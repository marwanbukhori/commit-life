"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { completePurchase } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";

const initialOptions = {
    // "test" is for sandbox. In production, change to live client ID.
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb", // "sb" uses a default sandbox account (might fail if not your own)
    currency: "USD",
    intent: "capture",
};

export function PayPalCheckout({ amount = "5.00", plan = "monthly" }: { amount?: string, plan?: string }) {
    const router = useRouter();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [processing, setProcessing] = useState(false);

    if (success) {
        return (
            <div className="bg-green-900/40 border border-green-500/50 p-6 rounded-lg text-center animate-in fade-in zoom-in duration-300">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4 animate-bounce" />
                <h3 className="text-2xl font-bold text-green-200 uppercase tracking-widest mb-2">Upgrade Complete!</h3>
                <p className="text-green-100/70 mb-6">Welcome to the elite farmers club.</p>
                <button
                    onClick={() => router.push("/profile")}
                    className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded uppercase tracking-widest shadow-lg transition-all"
                >
                    Go to Profile
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto relative z-10">
            {processing && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-2" />
                        <span className="text-amber-200 text-xs font-bold uppercase tracking-widest">Processing Payment...</span>
                    </div>
                </div>
            )}

            <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons
                    style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
                    createOrder={(data, actions) => {
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: amount,
                                    currency_code: "USD"
                                },
                                description: `CommitLife Premium Upgrade (${plan})`
                            }],
                            intent: "CAPTURE"
                        });
                    }}
                    onApprove={async (data, actions) => {
                        setProcessing(true);
                        try {
                            const details = await actions.order?.capture();
                            if (details?.status === "COMPLETED" && details.id) {
                                await completePurchase(details.id, amount, plan);
                                setSuccess(true);
                            }
                        } catch (err) {
                            console.error(err);
                            setError("Payment failed. Please try again.");
                        } finally {
                            setProcessing(false);
                        }
                    }}
                    onError={(err) => {
                        console.error(err);
                        setError("An error occurred connecting to PayPal.");
                    }}
                />
            </PayPalScriptProvider>

            {error && (
                <div className="mt-4 p-3 bg-red-900/50 border border-red-500/50 text-red-200 text-xs text-center rounded">
                    {error}
                </div>
            )}

            <p className="text-center text-[10px] text-amber-500/40 mt-4 uppercase tracking-widest">
                Secure Payment via PayPal
            </p>
        </div>
    );
}
