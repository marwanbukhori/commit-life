
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { plan } = await req.json();
        const userId = (session.user as any).id;
        const userEmail = session.user.email;

        if (!userId) {
            console.error("[CHECKOUT] User ID missing in session!");
            // return new NextResponse("User ID missing", { status: 400 }); // Optional: Fail fast?
        }

        // Define pricing
        const priceAmount = plan === 'annually' ? 4999 : 499; // in cents
        const productName = plan === 'annually' ? 'CommitLife Premium (1 Year)' : 'CommitLife Premium (1 Month)';

        // For local dev, fallback to localhost:3000
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: productName,
                            description: 'Unlock unlimited gardens, legendary pets, and advanced analytics.',
                            // images: [`${appUrl}/premium-badge.png`],
                        },
                        unit_amount: priceAmount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment', // Use 'subscription' for recurring billing
            success_url: `${appUrl}/profile?upgrade=success`,
            cancel_url: `${appUrl}/upgrade?canceled=true`,
            customer_email: userEmail || undefined,
            metadata: {
                userId: userId,
                plan: plan,
            },
        });

        return NextResponse.json({ url: checkoutSession.url });
    } catch (error) {
        console.error("[STRIPE_CHECKOUT_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
