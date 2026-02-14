"use client";

import { Navbar } from "@/components/ui/Navbar";
import { LivelyBackground } from "@/components/ui/LivelyBackground";
import Link from "next/link";
import { CheckCircle, Sprout, Crown, Zap, Shield, Heart } from "lucide-react";
import { useState } from "react";
import { StripeCheckout } from "@/components/ui/StripeCheckout";

export default function LandingPage() {
    const [plan, setPlan] = useState<'monthly' | 'annually'>('monthly');

    return (
        <main className="min-h-screen font-sans text-amber-100 relative selection:bg-green-500/30">
            {/* Background */}
            <LivelyBackground />
            <div className="fixed inset-0 z-0 bg-black/60 pointer-events-none" />

            <Navbar />

            {/* Hero Section */}
            <section className="relative z-10 container mx-auto px-4 pt-32 pb-20 text-center flex flex-col items-center">
                <div className="inline-flex items-center space-x-2 bg-green-900/40 border border-green-700/50 rounded-full px-4 py-1 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span className="text-xs font-bold text-green-300 uppercase tracking-widest">v1.0 Now Available</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tight mb-6" style={{ textShadow: "4px 4px 0 #3f2e18" }}>
                    Grow Your <span className="text-green-400">Habits</span>,<br />
                    Grow Your <span className="text-amber-400">Farm</span>.
                </h1>

                <p className="text-xl md:text-2xl text-amber-200/70 max-w-2xl mb-10 leading-relaxed">
                    Turn your daily tasks into a thriving digital ecosystem. Complete habits to evolve unique pixel companions and build your legacy.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                    <Link href="/" className="flex-1 bg-green-600 border-b-4 border-green-800 hover:bg-green-500 active:border-b-0 active:translate-y-1 transition-all py-4 rounded font-bold uppercase tracking-widest text-center shadow-lg shadow-green-900/50">
                        Start Farming Free
                    </Link>
                    <Link href="#pricing" className="flex-1 bg-amber-800 border-b-4 border-amber-950 hover:bg-amber-700 active:border-b-0 active:translate-y-1 transition-all py-4 rounded font-bold uppercase tracking-widest text-center shadow-lg">
                        View Plans
                    </Link>
                </div>

                {/* Mockup / Visual */}
                <div className="mt-20 relative w-full max-w-5xl aspect-video rounded-xl border-8 border-amber-950 shadow-2xl overflow-hidden group">
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500 z-10" />
                    <img src="/farm-bg.png" alt="App Preview" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" />
                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none group-hover:opacity-0 transition-opacity duration-300">
                        <div className="bg-black/50 backdrop-blur px-6 py-3 rounded-full border border-white/20">
                            <span className="text-sm font-bold uppercase tracking-widest">Hover to Preview</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="relative z-10 bg-amber-950/80 border-t-8 border-amber-900 py-20 backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold uppercase tracking-widest mb-4 text-amber-200">Why CommitLife?</h2>
                        <div className="w-24 h-1 bg-green-500 mx-auto rounded-full" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Sprout className="w-8 h-8 text-green-400" />}
                            title="Habit Gardens"
                            desc="Create distinct gardens (Pillars) for different areas of your life like Health, Career, or Creativity."
                        />
                        <FeatureCard
                            icon={<Heart className="w-8 h-8 text-red-400" />}
                            title="Companion Evolution"
                            desc="Adopt pixel pets that grow as you succeed. Watch them evolve from eggs to ancient guardians."
                        />
                        <FeatureCard
                            icon={<Zap className="w-8 h-8 text-yellow-400" />}
                            title="Gamified Streaks"
                            desc="Build momentum with streak modifiers. Keeping your habits alive keeps your farm thriving."
                        />
                        <FeatureCard
                            icon={<Shield className="w-8 h-8 text-blue-400" />}
                            title="Focus Mode"
                            desc="Built-in focus timer (Pomodoro) linked to your tasks to ensure deep work sessions."
                        />
                        <FeatureCard
                            icon={<Crown className="w-8 h-8 text-purple-400" />}
                            title="Premium Assets"
                            desc="Unlock legendary companions like Dragons and Crystal Trees to categorize your most epic goals."
                        />
                        <FeatureCard
                            icon={<CheckCircle className="w-8 h-8 text-emerald-400" />}
                            title="Detailed Analytics"
                            desc="Track your consistency with heatmaps and level progression charts."
                        />
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="relative z-10 py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold uppercase tracking-widest mb-4">Simple Pricing</h2>
                        <p className="text-amber-300/60 max-w-xl mx-auto">Start for free, upgrade for the ultimate farming experience.</p>
                    </div>

                    {/* Plan Toggle */}
                    <div className="flex justify-center mb-12">
                        <div className="bg-black/40 p-1 rounded-lg flex border border-white/10 backdrop-blur-sm">
                            <button
                                onClick={() => setPlan('monthly')}
                                className={`px-6 py-2 rounded text-xs font-bold uppercase tracking-widest transition-all ${plan === 'monthly' ? 'bg-yellow-600 text-black shadow-lg' : 'text-amber-400/60 hover:text-amber-200 hover:bg-white/5'}`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setPlan('annually')}
                                className={`px-6 py-2 rounded text-xs font-bold uppercase tracking-widest transition-all ${plan === 'annually' ? 'bg-yellow-600 text-black shadow-lg' : 'text-amber-400/60 hover:text-amber-200 hover:bg-white/5'}`}
                            >
                                Annually <span className="text-[9px] ml-1 opacity-70">(Save ~17%)</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Free Plan */}
                        <div className="bg-amber-900/20 border-4 border-amber-800/50 p-8 rounded-lg flex flex-col hover:border-amber-700/50 transition-colors">
                            <h3 className="text-xl font-bold uppercase tracking-widest text-amber-300/60 mb-2">Seedling</h3>
                            <div className="text-4xl font-bold mb-6 text-white">$0 <span className="text-sm font-normal text-amber-400/40">/ forever</span></div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-sm text-amber-100/80"><CheckCircle className="w-4 h-4 text-green-500" /> Up to 2 Gardens (Pillars)</li>
                                <li className="flex items-center gap-3 text-sm text-amber-100/80"><CheckCircle className="w-4 h-4 text-green-500" /> Basic Companions (Chicken, Sunflower)</li>
                                <li className="flex items-center gap-3 text-sm text-amber-100/80"><CheckCircle className="w-4 h-4 text-green-500" /> Basic Stats</li>
                            </ul>
                            <Link href="/" className="w-full py-3 border-2 border-amber-700 text-amber-300 font-bold uppercase text-xs tracking-widest hover:bg-amber-800 text-center transition-colors rounded">
                                Start Free
                            </Link>
                        </div>

                        {/* Pro Plan */}
                        <div className="bg-gradient-to-b from-amber-900/60 to-black/40 border-4 border-yellow-600/50 p-8 rounded-lg flex flex-col relative overflow-hidden group shadow-2xl">
                            <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                                Best Value
                            </div>
                            <h3 className="text-xl font-bold uppercase tracking-widest text-yellow-400 mb-2">Harvester</h3>
                            <div className="text-4xl font-bold mb-6 text-white">
                                ${plan === 'monthly' ? "4.99" : "49.99"}
                                <span className="text-sm font-normal text-amber-400/40"> / {plan === 'monthly' ? 'month' : 'year'}</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-sm text-amber-100"><CheckCircle className="w-4 h-4 text-yellow-500" /> Unlimited Gardens</li>
                                <li className="flex items-center gap-3 text-sm text-amber-100"><CheckCircle className="w-4 h-4 text-yellow-500" /> Legendary Companions (Dragons, Crystal Trees)</li>
                                <li className="flex items-center gap-3 text-sm text-amber-100"><CheckCircle className="w-4 h-4 text-yellow-500" /> Advanced Analytics</li>
                                <li className="flex items-center gap-3 text-sm text-amber-100"><CheckCircle className="w-4 h-4 text-yellow-500" /> Priority Support</li>
                            </ul>
                            <StripeCheckout
                                plan={plan}
                                className="bg-yellow-600 hover:bg-yellow-500 text-black border-yellow-800"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 bg-black/80 py-8 border-t border-white/10 text-center text-xs text-amber-500/40 uppercase tracking-widest">
                <div className="container mx-auto">
                    <p>&copy; 2025 CommitLife. All rights reserved.</p>
                    <div className="flex justify-center gap-4 mt-4">
                        <Link href="#" className="hover:text-amber-400 transition-colors">Terms</Link>
                        <Link href="#" className="hover:text-amber-400 transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-amber-400 transition-colors">Contact</Link>
                    </div>
                </div>
            </footer>
        </main>
    );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="bg-black/20 p-6 rounded-lg border border-white/5 hover:border-green-500/30 transition-colors group text-left">
            <div className="mb-4 bg-black/40 w-12 h-12 flex items-center justify-center rounded-lg group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-amber-100 mb-2 uppercase tracking-wide group-hover:text-green-400 transition-colors">
                {title}
            </h3>
            <p className="text-sm text-amber-200/50 leading-relaxed">
                {desc}
            </p>
        </div>
    );
}
