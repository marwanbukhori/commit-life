"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Habit } from '@/types';
import { Check, Droplets, Flame, RotateCcw, Send, X, CalendarDays, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HabitCardProps {
    habit: Habit;
    color: string;
    onCommit: (habitId: string, remark?: string) => void;
}

export function HabitCard({ habit, color, onCommit }: HabitCardProps) {
    const [showWaterDialog, setShowWaterDialog] = useState(false);
    const [remark, setRemark] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (showWaterDialog && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showWaterDialog]);

    const handleWaterClick = () => {
        if (habit.completedToday) return;
        setShowWaterDialog(true);
    };

    const handleConfirm = () => {
        onCommit(habit.id, remark.trim() || undefined);
        setShowWaterDialog(false);
        setRemark("");
    };

    const handleCancel = () => {
        setShowWaterDialog(false);
        setRemark("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleConfirm();
        }
        if (e.key === "Escape") handleCancel();
    };

    return (
        <>
            <div className={cn(
                "bg-amber-950/60 border-4 p-4 flex items-center justify-between transition-all",
                "border-amber-900/50 hover:bg-amber-900/30"
            )}>
                <div className="flex items-center space-x-4">
                    <div
                        className={cn(
                            "w-12 h-12 border-4 flex items-center justify-center transition-all",
                            habit.completedToday
                                ? "bg-green-900/50 border-green-700 text-green-400"
                                : "bg-amber-950/80 border-amber-800 text-amber-600/60"
                        )}
                    >
                        {habit.frequency === 'daily' ? <RotateCcw className="w-5 h-5" /> :
                            habit.frequency === 'weekly' ? <CalendarDays className="w-5 h-5" /> :
                                habit.frequency === 'onetime' ? <Sparkles className="w-5 h-5" /> :
                                    <Flame className="w-5 h-5" />}
                    </div>

                    <div>
                        <h4 className={cn("font-bold text-sm uppercase tracking-wider", habit.completedToday ? "text-amber-600/40 line-through" : "text-amber-100")}>
                            {habit.name}
                        </h4>
                        <div className="flex items-center space-x-3 text-[10px] text-amber-400/40 mt-1 font-mono">
                            <span>
                                <span className="text-orange-400">STREAK:</span> {habit.streak}
                            </span>
                            {habit.completedToday && habit.lastRemark && (
                                <span className="text-green-400/60 normal-case tracking-normal">
                                    &quot;{habit.lastRemark}&quot;
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleWaterClick}
                    disabled={habit.completedToday}
                    className={cn(
                        "px-4 py-3 border-b-4 text-xs font-bold uppercase tracking-widest transition-all",
                        habit.completedToday
                            ? "bg-amber-900/30 border-amber-950 text-amber-700/40 cursor-not-allowed"
                            : "bg-blue-600 border-blue-900 text-white hover:bg-blue-500 active:translate-y-1 active:border-b-0"
                    )}
                >
                    {habit.completedToday ? (
                        <span className="flex items-center space-x-2">
                            <Check className="w-4 h-4" />
                            <span>Watered</span>
                        </span>
                    ) : (
                        <span className="flex items-center space-x-2">
                            <Droplets className="w-4 h-4" />
                            <span>Water</span>
                        </span>
                    )}
                </button>
            </div>

            {/* Water Confirmation Dialog */}
            {showWaterDialog && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60" onClick={handleCancel} />
                    <div className="relative bg-amber-950 border-4 border-amber-800 w-full max-w-md z-10">
                        <div className="flex items-center justify-between px-5 py-3 bg-amber-900 border-b-4 border-amber-800">
                            <h3 className="text-sm text-amber-100 uppercase tracking-widest font-bold" style={{ textShadow: "2px 2px 0 #000" }}>
                                <Droplets className="w-4 h-4 inline mr-2 text-blue-400" />
                                Water: {habit.name}
                            </h3>
                            <button onClick={handleCancel} className="text-amber-400/50 hover:text-amber-100 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-amber-400/50 mb-2 font-bold">
                                    Add a remark <span className="text-amber-600/30">(optional)</span>
                                </label>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={remark}
                                    onChange={(e) => setRemark(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="e.g. 5x5 32kg, 30 min run"
                                    className="w-full bg-amber-950/80 border-4 border-amber-800 px-4 py-3 text-amber-100 text-sm placeholder-amber-700/50 focus:outline-none focus:border-blue-600 transition-colors"
                                    maxLength={100}
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 py-3 bg-amber-900/50 border-b-4 border-amber-950 text-amber-300/60 text-xs font-bold uppercase tracking-widest hover:bg-amber-800/50 active:border-b-0 active:translate-y-1 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className="flex-[2] flex items-center justify-center space-x-2 py-3 bg-blue-600 border-b-4 border-blue-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-blue-500 active:border-b-0 active:translate-y-1 transition-all"
                                >
                                    <Droplets className="w-4 h-4" />
                                    <span>Water It!</span>
                                </button>
                            </div>
                            <p className="text-[9px] text-amber-600/30 tracking-wide text-center">Press Enter to confirm, Escape to cancel</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
