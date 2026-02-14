"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from "@/components/ui/Navbar";
import { PetDisplay } from "@/components/ui/PetDisplay";
import { PetSprite } from "@/components/ui/PetSprite";
import { HabitCard } from "@/components/ui/HabitCard";
import { CreateHabitModal } from "@/components/ui/CreateHabitModal";
import { BulkImportModal } from "@/components/ui/BulkImportModal";
import { AnalyticsModal } from "@/components/ui/AnalyticsModal";
import { PremiumPopup } from "@/components/ui/PremiumPopup";
import { useSession } from "next-auth/react";
import { Pillar, Habit } from "@/types";
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Sprout } from 'lucide-react';
import Link from 'next/link';
import { getPillarDetails, commitHabit, createHabit } from "@/app/actions";

export default function PillarPage() {
    const params = useParams();
    const router = useRouter();
    const pillarId = params.id as string;
    const [pillar, setPillar] = useState<Pillar | null>(null);
    const [habits, setHabits] = useState<Habit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [habitModalOpen, setHabitModalOpen] = useState(false);
    const [bulkModalOpen, setBulkModalOpen] = useState(false);
    const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);
    const [showPremiumPopup, setShowPremiumPopup] = useState(false);
    const { data: session } = useSession();
    const isPremium = (session?.user as any)?.isPremium;

    useEffect(() => {
        const fetchPillarData = async () => {
            if (!pillarId) return;
            setLoading(true);
            setError(null);
            try {
                const data = await getPillarDetails(pillarId);
                setPillar(data.pillar as any);
                setHabits(data.habits as any);
            } catch (err: any) {
                console.error("Failed to fetch garden data:", err);
                if (err.message === "Unauthorized" || err.message.includes("not found")) {
                    router.push('/');
                    return;
                }
                setError("Failed to load garden data. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchPillarData();
    }, [pillarId]);

    const handleCommit = async (habitId: string, remark?: string) => {
        const habitIndex = habits.findIndex(h => h.id === habitId);
        if (habitIndex === -1) return;
        const oldHabit = habits[habitIndex];

        const newHabits = [...habits];
        newHabits[habitIndex] = { ...oldHabit, completedToday: true, streak: oldHabit.streak + 1, lastRemark: remark || null };
        setHabits(newHabits);

        try {
            await commitHabit(habitId, remark);
            const { pillar: updatedPillar } = await getPillarDetails(pillarId);
            setPillar(updatedPillar as any);
        } catch (err) {
            console.error("Commit failed:", err);
            newHabits[habitIndex] = oldHabit;
            setHabits(newHabits);
            alert("Failed to save progress. Try again?");
        }
    };

    const handleCreateHabit = async (name: string, frequency: string) => {
        try {
            await createHabit(pillarId, name, frequency);
            // Refresh data
            const data = await getPillarDetails(pillarId);
            setPillar(data.pillar as any);
            setHabits(data.habits as any);
        } catch (err) {
            console.error("Failed to create chore:", err);
            alert("Failed to plant seed. Try again?");
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen pb-20 font-sans relative">
                <div className="fixed inset-0 z-0" style={{ backgroundImage: 'url(/farm-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', imageRendering: 'pixelated' }} />
                <div className="fixed inset-0 z-0 bg-black/65" />
                <div className="relative z-10 flex items-center justify-center min-h-screen">
                    <p className="text-amber-100 text-xl animate-pulse">Loading garden...</p>
                </div>
            </main>
        );
    }

    if (error || !pillar) {
        return (
            <main className="min-h-screen pb-20 font-sans relative">
                <div className="fixed inset-0 z-0" style={{ backgroundImage: 'url(/farm-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', imageRendering: 'pixelated' }} />
                <div className="fixed inset-0 z-0 bg-black/65" />
                <div className="relative z-10 flex items-center justify-center min-h-screen">
                    <p className="text-red-400 text-xl">{error || "Garden not found."}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen pb-20 font-sans relative">
            <div className="fixed inset-0 z-0" style={{ backgroundImage: 'url(/farm-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', imageRendering: 'pixelated' }} />
            <div className="fixed inset-0 z-0 bg-black/65" />

            <div className="relative z-10">
                <Navbar />

                <div className="container mx-auto px-4 pt-24">
                    {/* Header / Back */}
                    <div className="mb-8">
                        <Link href="/" className="inline-flex items-center text-amber-600/60 hover:text-amber-100 transition-colors mb-4 uppercase text-xs font-bold tracking-widest group">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Farm
                        </Link>

                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b-4 border-amber-900/40 pb-6">
                            <div>
                                <h1 className="text-4xl font-bold text-amber-100 mb-2 uppercase tracking-widest" style={{ color: pillar.color, textShadow: '4px 4px 0 #000' }}>{pillar.name}</h1>
                                <p className="text-amber-400/40 text-lg border-l-4 border-amber-800/60 pl-4">{pillar.description}</p>
                            </div>

                            {pillar.pet && (
                                <div className="flex items-center space-x-4 bg-amber-950/60 p-2 border-4 border-amber-900/50">
                                    <div className="text-right px-4">
                                        <p className="text-[10px] text-amber-400/40 uppercase tracking-widest">Companion</p>
                                        <p className="text-lg font-bold text-amber-100">{pillar.pet.name}</p>
                                    </div>
                                    <div className="border-2 border-amber-900 p-1 bg-amber-950/50">
                                        <PetSprite species={pillar.pet.species} stage={pillar.pet.stage} className="w-12 h-12" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Main Pet View */}
                        <div className="lg:col-span-1">
                            <div className="bg-amber-950/60 border-4 border-amber-900/50 p-8 flex flex-col items-center justify-center sticky top-24">
                                {pillar.pet ? (
                                    <>
                                        <div className="flex flex-col items-center mb-8">
                                            <div className="flex gap-2 mb-6 z-20 relative">
                                                <div className="bg-amber-950/80 border-2 border-amber-500/50 px-3 py-1 rounded-full shadow-lg">
                                                    <span className="text-amber-500 font-bold text-xs uppercase tracking-widest">Level {pillar.pet.level}</span>
                                                </div>
                                                <button
                                                    onClick={() => setAnalyticsModalOpen(true)}
                                                    className="bg-purple-900/80 border-2 border-purple-500/50 px-2 py-1 rounded-full hover:bg-purple-800 transition-colors shadow-lg"
                                                    title="View Analytics"
                                                >
                                                    <Sprout className="w-4 h-4 text-purple-200" />
                                                </button>
                                            </div>
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-green-400/5 blur-3xl rounded-full" />
                                                <PetDisplay pet={pillar.pet} className="scale-125 relative z-10" />
                                            </div>
                                        </div>

                                        <div className="w-full mt-8 space-y-4">
                                            <div className="flex justify-between text-[10px] uppercase font-bold text-amber-400/50 tracking-widest">
                                                <span>Growth</span>
                                                <span>{pillar.pet.xp} / {pillar.pet.xpToNextLevel} XP</span>
                                            </div>
                                            <div className="w-full h-4 bg-amber-950 border-2 border-amber-800 p-0.5">
                                                <div
                                                    className="h-full transition-all duration-500 ease-linear"
                                                    style={{
                                                        width: `${(pillar.pet.xp / pillar.pet.xpToNextLevel) * 100}%`,
                                                        backgroundColor: '#4ade80',
                                                        boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.2)'
                                                    }}
                                                />
                                            </div>
                                            <p className="text-center text-[10px] text-amber-600/40 mt-2 font-mono">
                                                Tend your habits to help {pillar.pet.name} grow!
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-amber-600/40 text-sm">No companion yet. Plant some seeds!</div>
                                )}
                            </div>
                        </div>

                        {/* Habits List */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between border-b-4 border-amber-900/40 pb-2">
                                <h2 className="text-xl font-bold text-amber-100 uppercase tracking-widest">Chores Checklist</h2>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => isPremium ? setBulkModalOpen(true) : setShowPremiumPopup(true)}
                                        className={`px-3 py-2 border-b-4 transition-all text-[10px] font-bold uppercase tracking-widest flex items-center gap-2
                                            ${isPremium
                                                ? 'bg-blue-700 border-blue-950 hover:bg-blue-600 active:border-b-0 active:translate-y-1 text-white'
                                                : 'bg-gray-700 border-gray-900 text-gray-400 cursor-pointer hover:bg-gray-600'
                                            }`}
                                    >
                                        Import
                                        {!isPremium && <span className="text-xs">🔒</span>}
                                    </button>
                                    <button
                                        onClick={() => setHabitModalOpen(true)}
                                        className="flex items-center space-x-2 px-4 py-2 bg-green-700 border-b-4 border-green-950 hover:bg-green-600 active:border-b-0 active:translate-y-1 transition-all text-xs font-bold uppercase text-white"
                                    >
                                        <Sprout className="w-4 h-4" />
                                        <span>New Chore</span>
                                    </button>
                                </div>
                            </div>

                            {habits.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 mx-auto bg-amber-950/60 border-4 border-amber-900/40 flex items-center justify-center mb-4">
                                        <span className="text-4xl">🌱</span>
                                    </div>
                                    <p className="text-amber-400/40 text-sm mb-4">No chores planted yet.</p>
                                    <button
                                        onClick={() => setHabitModalOpen(true)}
                                        className="px-6 py-3 bg-green-700 border-b-4 border-green-950 text-white text-xs font-bold uppercase tracking-widest hover:bg-green-600 active:border-b-0 active:translate-y-1 transition-all"
                                    >
                                        Plant Your First Seed
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {habits.map(habit => (
                                        <HabitCard
                                            key={habit.id}
                                            habit={habit}
                                            color={pillar.color}
                                            onCommit={handleCommit}
                                        />
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={() => setHabitModalOpen(true)}
                                className="w-full py-6 bg-amber-950/30 border-4 border-dashed border-amber-900/30 text-amber-700/40 hover:text-green-400 hover:bg-amber-950/50 hover:border-green-700/40 transition-all flex items-center justify-center space-x-2 group"
                            >
                                <Sprout className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                <span className="uppercase font-bold tracking-widest text-sm">Plant New Seed</span>
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Create Habit Modal */}
            <CreateHabitModal
                isOpen={habitModalOpen}
                onClose={() => setHabitModalOpen(false)}
                onSubmit={handleCreateHabit}
            />
            <BulkImportModal
                isOpen={bulkModalOpen}
                onClose={() => setBulkModalOpen(false)}
                pillarId={pillarId}
                onSuccess={() => window.location.reload()}
            />
            <AnalyticsModal
                isOpen={analyticsModalOpen}
                onClose={() => setAnalyticsModalOpen(false)}
                pillarId={pillarId}
            />
            <PremiumPopup
                isOpen={showPremiumPopup}
                onClose={() => setShowPremiumPopup(false)}
                title="Premium Feature"
                message="Bulk importing habits is a Premium feature. Upgrade to save time!"
            />
        </main >
    );
}
