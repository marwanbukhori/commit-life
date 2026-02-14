
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { addMonths, addYears } from "date-fns";
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET || ""
        );
    } catch (err: any) {
        console.error("[WEBHOOK] Signature Verification Failed:", err.message);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan || 'monthly';
        const amount = (session.amount_total || 0) / 100;

        if (!userId) {
            console.error("[WEBHOOK] User ID missing in metadata");
            return new NextResponse("User ID missing in metadata", { status: 400 });
        }

        try {
            // Secure database update
            await prisma.payment.create({
                data: {
                    userId: userId,
                    amount: amount,
                    currency: "USD",
                    status: "COMPLETED",
                    reference: session.id,
                    plan: plan
                }
            });

            // Extend Subscription
            const user = await prisma.user.findUnique({ where: { id: userId } });

            if (!user) {
                console.error("[WEBHOOK] User not found during update:", userId);
                throw new Error("User not found");
            }

            const currentEnd = user?.subscriptionEnd && user.subscriptionEnd > new Date()
                ? new Date(user.subscriptionEnd)
                : new Date();

            let newEnd;
            if (plan === 'annually') {
                newEnd = addYears(currentEnd, 1);
            } else {
                newEnd = addMonths(currentEnd, 1);
            }

            await prisma.user.update({
                where: { id: userId },
                data: {
                    isPremium: true,
                    subscriptionEnd: newEnd
                }
            });

        } catch (error) {
            console.error("Database update failed inside Webhook:", error);
            return new NextResponse("Database Error", { status: 500 });
        }
    }

    return new NextResponse(null, { status: 200 });
}
