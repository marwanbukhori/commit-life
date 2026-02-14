import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma) as any,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        session: async ({ session, user }) => {
            if (session?.user) {
                (session.user as any).id = user.id;
                // Fetch premium status and role
                const dbUser = await prisma.user.findUnique({
                    where: { id: user.id },
                    select: { isPremium: true, role: true }, // subscriptionEnd: true
                });

                let isPremium = dbUser?.isPremium ?? false;

                // Check for lazy expiration (Uncomment after server restart)
                /*
                if (isPremium && (dbUser as any)?.subscriptionEnd && new Date() > new Date((dbUser as any).subscriptionEnd)) {
                    // Subscription expired
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { isPremium: false }
                    });
                    isPremium = false;
                }
                */

                (session.user as any).isPremium = isPremium;
                (session.user as any).role = dbUser?.role ?? 'USER';

                // Dev Backdoor: Promote marwanbukhori@gmail.com to ADMIN if not already
                if (session.user.email === 'marwanbukhori.dev@gmail.com' && (session.user as any).role !== 'ADMIN') {
                    await prisma.user.update({ where: { id: user.id }, data: { role: 'ADMIN' } });
                    (session.user as any).role = 'ADMIN';
                }
            }
            return session;
        },
    },
    pages: {
        signIn: "/",
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
