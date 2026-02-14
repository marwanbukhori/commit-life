"use client";

import { useState } from "react";
import { PayPalCheckout } from "@/components/ui/PayPalCheckout";
import { StripeCheckout } from "@/components/ui/StripeCheckout";

export function PricingSection() {
    const [plan, setPlan] = useState<'monthly' | 'annually'>('monthly');

    const price = plan === 'monthly' ? "4.99" : "49.99";
    const savings = plan === 'annually' ? "Save ~17%" : null;

    return (
        <div className="bg-gradient-to-b from-amber-900/80 to-black border-4 border-yellow-600/30 p-8 rounded-xl shadow-2xl relative overflow-hidden animate-in slide-in-from-right-4 duration-700 delay-200">
            {/* Best Value Badge */}
            {plan === 'annually' && (
                <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold px-3 py-1 uppercase tracking-widest animate-in fade-in">
                    Best Value
                </div>
            )}

            {/* Plan Toggle */}
            <div className="flex justify-center mb-8">
                <div className="bg-black/50 p-1 rounded-lg flex border border-white/10">
                    <button
                        onClick={() => setPlan('monthly')}
                        className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-widest transition-all ${plan === 'monthly' ? 'bg-yellow-600 text-black shadow-lg' : 'text-amber-400/60 hover:text-amber-200'}`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setPlan('annually')}
                        className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-widest transition-all ${plan === 'annually' ? 'bg-yellow-600 text-black shadow-lg' : 'text-amber-400/60 hover:text-amber-200'}`}
                    >
                        Annual
                    </button>
                </div>
            </div>

            <div className="text-center mb-8">
                <div className="text-sm font-bold text-yellow-400/60 uppercase tracking-widest mb-1">Total Due</div>
                <div className="text-5xl font-bold text-white tracking-tighter">${price}</div>
                <div className="text-xs text-amber-400/40 mt-1 uppercase tracking-widest">
                    {plan === 'monthly' ? "Per Month (Promo)" : "Per Year"}
                </div>
                {savings && <div className="text-green-400 text-xs font-bold uppercase tracking-widest mt-2 animate-pulse">{savings}</div>}
            </div>

            {/* Payment Options Container */}
            <div className="bg-white/5 p-4 rounded-lg border border-white/10 space-y-4">
                <StripeCheckout plan={plan} />
            </div>

            <div className="mt-6 text-center">
                <p className="text-[10px] text-amber-500/40 uppercase tracking-widest">
                    100% Satisfaction Guarantee
                </p>
                {plan === 'monthly' && (
                    <p className="text-[9px] text-amber-500/30 mt-1">
                        Normal Price: $9.99/mo
                    </p>
                )}
            </div>
        </div>
    );
}
