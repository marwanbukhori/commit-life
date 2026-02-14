"use client";

import React, { useState } from "react";
import { PillarCard } from "@/components/ui/PillarCard";
import { CreatePillarModal } from "@/components/ui/CreatePillarModal";
import { PremiumPopup } from "@/components/ui/PremiumPopup";
import { HabitCard } from "@/components/ui/HabitCard";
import { createPillar, commitHabit, updateGardenTitle } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { Pillar, Habit } from "@/types";
import { Flower2, LogIn, Edit, Check, Settings, CloudSun, CalendarDays, Sprout } from "lucide-react";

interface DashboardGridProps {
    pillars: Pillar[];
    todaysChores: (Habit & { pillar: Pillar })[];
    weeklyChores: (Habit & { pillar: Pillar })[];
    sectionTitle: string;
}

export function DashboardGrid({ pillars, todaysChores, weeklyChores, sectionTitle }: DashboardGridProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [signInPrompt, setSignInPrompt] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [titleInput, setTitleInput] = useState(sectionTitle);
    const [showPremiumPopup, setShowPremiumPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const { data: session } = useSession();
    const router = useRouter();

    const handlePlantClick = () => {
        if (!session?.user) {
            setSignInPrompt(true);
            return;
        }
        setModalOpen(true);
    };

    const handleCreatePillar = async (name: string, description: string, color: string, companionSpecies: string, companionName?: string) => {
        setLoading(true);
        try {
            await createPillar(name, description, color, companionSpecies, companionName);
            router.refresh();
        } catch (err: any) {
            if (err.message.toLowerCase().includes("limit") || err.message.toLowerCase().includes("upgrade")) {
                setPopupMessage("You've reached the free limit for gardens. Upgrade to plant more!");
                setShowPremiumPopup(true);
            } else {
                alert(err.message || "Failed to plant garden.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCommitHabit = async (habitId: string, remark?: string) => {
        try {
            await commitHabit(habitId, remark);
            router.refresh();
        } catch (err) {
            console.error("Failed to tend chore:", err);
            alert("Failed to confirm task. Try again.");
        }
    };

    const handleTitleSave = async () => {
        if (!titleInput.trim()) return;
        try {
            await updateGardenTitle(titleInput.trim());
            setIsEditingTitle(false);
            router.refresh();
        } catch (err) {
            alert("Failed to update dashboard title.");
        }
    };

    return (
        <div className="space-y-12">

            {/* ─── 1. TODAY'S FINDINGS (Daily) ─── */}
            <section>
                <div className="flex items-center space-x-3 mb-6 border-b-4 border-amber-900/40 pb-4">
                    <CloudSun className="w-8 h-8 text-amber-100" />
                    <h2 className="text-2xl font-bold text-amber-100 uppercase tracking-widest" style={{ textShadow: "2px 2px 0 #000" }}>
                        Today&apos;s Chores
                    </h2>
                </div>

                {todaysChores.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {todaysChores.map((habit) => (
                            <HabitCard
                                key={habit.id}
                                habit={habit}
                                color={habit.pillar.color}
                                onCommit={handleCommitHabit}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-amber-950/40 border-4 border-amber-900/30 p-8 flex flex-col items-center justify-center text-center">
                        <span className="text-4xl mb-4">🌻</span>
                        <p className="text-amber-200/60 font-medium">All daily chores complete!</p>
                        <p className="text-sm text-amber-600/40 mt-1">Enjoy the sunshine.</p>
                    </div>
                )}
            </section>

            {/* ─── 2. WEEKLY HARVEST (Weekly) ─── */}
            {weeklyChores.length > 0 && (
                <section>
                    <div className="flex items-center space-x-3 mb-6 border-b-4 border-amber-900/40 pb-4">
                        <CalendarDays className="w-8 h-8 text-amber-100" />
                        <h2 className="text-2xl font-bold text-amber-100 uppercase tracking-widest" style={{ textShadow: "2px 2px 0 #000" }}>
                            Weekly Harvest
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {weeklyChores.map((habit) => (
                            <HabitCard
                                key={habit.id}
                                habit={habit}
                                color={habit.pillar.color}
                                onCommit={handleCommitHabit}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* ─── 3. GARDENS (Customizable Title) ─── */}
            <section className="pt-8">
                <div className="flex items-center justify-between mb-8 border-b-4 border-amber-900/40 pb-6">
                    <div className="flex items-center space-x-4 group">
                        {isEditingTitle ? (
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={titleInput}
                                    onChange={(e) => setTitleInput(e.target.value)}
                                    className="bg-amber-950/80 border-b-4 border-amber-700 text-2xl font-bold text-amber-100 uppercase tracking-widest focus:outline-none focus:border-green-500 px-2 py-1 w-full max-w-md"
                                    autoFocus
                                    onBlur={handleTitleSave}
                                    onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
                                />
                                <button onClick={handleTitleSave} className="bg-green-700 p-2 text-white hover:bg-green-600 transition-colors">
                                    <Check className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-3xl font-bold text-amber-100 uppercase tracking-widest" style={{ textShadow: '4px 4px 0 #0a0604' }}>
                                    {sectionTitle}
                                </h1>
                                {session?.user && (
                                    <button
                                        onClick={() => setIsEditingTitle(true)}
                                        className="opacity-0 group-hover:opacity-100 text-amber-600/50 hover:text-amber-200 transition-all p-2"
                                        title="Rename Section"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pillars.map((pillar) => (
                        <PillarCard key={pillar.id} pillar={pillar} />
                    ))}

                    <button
                        onClick={handlePlantClick}
                        className="group relative h-full min-h-[200px] bg-amber-950/20 border-4 border-dashed border-amber-900/40 flex flex-col items-center justify-center p-6 hover:bg-amber-950/40 hover:border-green-700/60 transition-all duration-300"
                    >
                        <div className="w-16 h-16 bg-amber-950/50 border-4 border-amber-900/60 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300 shadow-xl">
                            <Flower2 className="w-8 h-8 text-amber-700/60 group-hover:text-green-400 transition-colors" />
                        </div>
                        <span className="text-xs uppercase tracking-widest text-amber-600/60 group-hover:text-green-300 font-medium mt-4">
                            Plant New Garden
                        </span>
                    </button>
                </div>
            </section>


            {/* Create Garden Modal */}
            <CreatePillarModal
                isOpen={modalOpen}
                isPremium={(session?.user as any)?.isPremium}
                onClose={() => setModalOpen(false)}
                onSubmit={handleCreatePillar}
            />

            <PremiumPopup
                isOpen={showPremiumPopup}
                onClose={() => setShowPremiumPopup(false)}
                title="Garden Limit Reached"
                message={popupMessage}
            />

            {/* Sign In Prompt Modal */}
            {signInPrompt && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70" onClick={() => setSignInPrompt(false)} />
                    <div className="relative bg-amber-950 border-4 border-amber-800 w-full max-w-sm z-10 text-center">
                        <div className="px-6 py-4 bg-amber-900 border-b-4 border-amber-800">
                            <h2 className="text-lg text-amber-100 uppercase tracking-widest font-bold" style={{ textShadow: "2px 2px 0 #000" }}>
                                Welcome, Farmer!
                            </h2>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="w-20 h-20 mx-auto bg-amber-900/50 border-4 border-amber-800 flex items-center justify-center">
                                <span className="text-4xl">🌱</span>
                            </div>
                            <p className="text-amber-300/60 text-sm leading-relaxed">
                                Sign in to start planting your gardens and growing your habits!
                            </p>
                            <button
                                onClick={() => { setSignInPrompt(false); signIn("google"); }}
                                className="w-full flex items-center justify-center space-x-3 py-4 bg-green-700 border-b-4 border-green-950 text-white text-sm font-bold uppercase tracking-widest hover:bg-green-600 active:border-b-0 active:translate-y-1 transition-all"
                            >
                                <LogIn className="w-5 h-5" />
                                <span>Sign In with Google</span>
                            </button>
                            <button
                                onClick={() => setSignInPrompt(false)}
                                className="text-amber-600/50 text-xs uppercase tracking-widest hover:text-amber-300 transition-colors"
                            >
                                Maybe Later
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
