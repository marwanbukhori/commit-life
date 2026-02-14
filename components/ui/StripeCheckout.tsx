
"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { cn } from "@/lib/utils";

interface StripeCheckoutProps {
    plan: "monthly" | "annually";
    className?: string;
}

export function StripeCheckout({ plan, className }: StripeCheckoutProps) {
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan }),
            });

            if (res.status === 401) {
                signIn("google", { callbackUrl: "/profile" }); // or wherever you want them after login
                setLoading(false);
                return;
            }

            if (!res.ok) throw new Error("Failed to initiate checkout");

            const { url } = await res.json();
            if (url) {
                window.location.href = url;
            } else {
                throw new Error("No checkout URL returned");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleCheckout}
            disabled={loading}
            className={cn("w-full flex items-center justify-center space-x-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded uppercase tracking-widest shadow-lg transition-all border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed", className)}
        >
            {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <CreditCard className="w-5 h-5" />
            )}
            <span>{loading ? "Redirecting..." : "Pay with Card"}</span>
        </button>
    );
}
