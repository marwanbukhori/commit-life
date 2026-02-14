import { Navbar } from "@/components/ui/Navbar";
import { LivelyBackground } from "@/components/ui/LivelyBackground";
import { PricingSection } from "@/components/ui/PricingSection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { CheckCircle, Crown } from "lucide-react";

export default async function UpgradePage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/");

    const user = await prisma.user.findUnique({
        where: { id: (session.user as any).id },
        select: { isPremium: true }
    });

    if (user?.isPremium) {
        return (
            <main className="min-h-screen bg-black text-amber-100 font-sans relative">
                <LivelyBackground />
                <div className="fixed inset-0 bg-black/60 z-0" />
                <Navbar />

                <div className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-center min-h-[80vh]">
                    <div className="bg-amber-900/20 backdrop-blur border-4 border-yellow-600/50 p-8 rounded-xl max-w-md w-full text-center animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-yellow-400/50 shadow-[0_0_30px_rgba(255,215,0,0.3)]">
                            <Crown className="w-10 h-10 text-yellow-400 drop-shadow-lg" />
                        </div>
                        <h1 className="text-3xl font-bold text-yellow-200 uppercase tracking-widest mb-2" style={{ textShadow: "2px 2px 0 #000" }}>
                            PREMIUM ACTIVE
                        </h1>
                        <p className="text-amber-100/70 mb-8 leading-relaxed">
                            Your farm is flourishing with elite status. Thank you for your support!
                        </p>
                        <a href="/profile" className="inline-block bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded uppercase tracking-widest transition-colors shadow-lg border-b-4 border-yellow-800 active:border-b-0 active:translate-y-1">
                            Go to Garden
                        </a>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black text-amber-100 font-sans relative selection:bg-yellow-500/30">
            <LivelyBackground />
            <div className="fixed inset-0 bg-black/70 z-0" />
            <Navbar />

            <div className="relative z-10 container mx-auto px-4 pt-24 pb-12 flex flex-col items-center justify-center min-h-screen">

                <div className="text-center mb-10 animate-in slide-in-from-top-4 duration-700">
                    <div className="inline-flex items-center space-x-2 bg-yellow-900/30 border border-yellow-500/30 rounded-full px-4 py-1 mb-4 backdrop-blur-sm">
                        <Crown className="w-4 h-4 text-yellow-400" />
                        <span className="text-xs font-bold text-yellow-200 uppercase tracking-widest">Limited Time Offer</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tight mb-4" style={{ textShadow: "3px 3px 0 #3f2e18" }}>
                        Unlock <span className="text-yellow-400">Harvester</span> Status
                    </h1>
                    <p className="text-lg text-amber-200/60 max-w-xl mx-auto leading-relaxed">
                        Become a legendary farmer. Gain access to exclusive companions, infinite gardens, and advanced analytics.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl items-start">

                    {/* Benefits List */}
                    <div className="bg-amber-950/40 backdrop-blur border-l-4 border-yellow-600/50 p-6 rounded-r-lg space-y-6 animate-in slide-in-from-left-4 duration-700 delay-100">
                        <h3 className="text-xl font-bold text-yellow-200 uppercase tracking-widest border-b border-white/10 pb-2">
                            Premium Benefits
                        </h3>
                        <BenefitItem text="Unique Legendary Pets (Dragon, Crystal Tree)" />
                        <BenefitItem text="Unlimited Pillar Gardens" />
                        <BenefitItem text="Advanced Progress Analytics" />
                        <BenefitItem text="Priority Support & Badge" />
                        <BenefitItem text="Support Future Development" />

                        <div className="pt-4 mt-4 border-t border-white/10 text-xs text-amber-400/60 italic">
                            * Cancel anytime. Billed securely via PayPal.
                        </div>
                    </div>

                    {/* Checkout Box */}
                    <PricingSection />

                </div>

            </div>
        </main>
    );
}

function BenefitItem({ text }: { text: string }) {
    return (
        <div className="flex items-center space-x-3 group">
            <div className="w-5 h-5 rounded-full bg-yellow-900/50 border border-yellow-500/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle className="w-3 h-3 text-yellow-400" />
            </div>
            <span className="text-sm text-amber-100 group-hover:text-white transition-colors uppercase tracking-wide font-bold shadow-black drop-shadow-md">
                {text}
            </span>
        </div>
    );
}
