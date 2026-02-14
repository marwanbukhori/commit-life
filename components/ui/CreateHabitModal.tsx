"use client";

import React, { useState } from "react";
import { X, Sprout } from "lucide-react";

interface CreateHabitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string, frequency: string) => void;
}

const FREQUENCY_OPTIONS = [
    { value: "daily", label: "Daily", icon: "☀️", desc: "Every day" },
    { value: "weekly", label: "Weekly", icon: "📅", desc: "Once a week" },
    { value: "onetime", label: "Single", icon: "✨", desc: "One time task" },
    { value: "custom", label: "Flexible", icon: "🌿", desc: "As needed" },
];

export function CreateHabitModal({ isOpen, onClose, onSubmit }: CreateHabitModalProps) {
    const [name, setName] = useState("");
    const [frequency, setFrequency] = useState("daily");

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSubmit(name.trim(), frequency);
        setName("");
        setFrequency("daily");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-amber-950 border-4 border-amber-800 w-full max-w-md z-10">
                {/* Title Bar */}
                <div className="flex items-center justify-between px-6 py-4 bg-amber-900 border-b-4 border-amber-800">
                    <h2 className="text-lg text-amber-100 uppercase tracking-widest font-bold" style={{ textShadow: "2px 2px 0 #000" }}>
                        Plant a Seed
                    </h2>
                    <button onClick={onClose} className="text-amber-400/50 hover:text-amber-100 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Habit Name */}
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-amber-400/50 mb-2 font-bold">
                            Chore Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Fix Fence, Water Melons"
                            className="w-full bg-amber-950/80 border-4 border-amber-800 px-4 py-3 text-amber-100 text-sm placeholder-amber-700/50 focus:outline-none focus:border-green-600 transition-colors"
                            maxLength={50}
                            required
                            autoFocus
                        />
                    </div>

                    {/* Frequency */}
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-amber-400/50 mb-3 font-bold">
                            How Often?
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {FREQUENCY_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setFrequency(opt.value)}
                                    className={`flex flex-col items-center p-2 border-4 transition-all ${frequency === opt.value
                                            ? "border-green-500 bg-green-900/20"
                                            : "border-amber-800 bg-amber-950/50 hover:border-amber-600"
                                        }`}
                                >
                                    <span className="text-xl mb-1">{opt.icon}</span>
                                    <span className={`text-[8px] uppercase tracking-widest font-bold truncate w-full ${frequency === opt.value ? "text-green-400" : "text-amber-300/50"
                                        }`}>
                                        {opt.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                        <p className="text-[10px] text-amber-500/40 mt-1 pl-1">
                            {FREQUENCY_OPTIONS.find(f => f.value === frequency)?.desc}
                        </p>
                    </div>

                    {/* Preview */}
                    <div className="bg-amber-950/80 border-2 border-amber-800 p-4 flex items-center space-x-4">
                        <div className="w-10 h-10 bg-amber-900/50 border-2 border-amber-800 flex items-center justify-center">
                            <Sprout className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-amber-100">{name || "New Chore"}</p>
                            <p className="text-[10px] text-amber-400/40 uppercase tracking-widest">
                                {FREQUENCY_OPTIONS.find(f => f.value === frequency)?.desc}
                            </p>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={!name.trim()}
                        className="w-full py-4 bg-green-700 border-b-4 border-green-950 text-white text-sm font-bold uppercase tracking-widest hover:bg-green-600 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="flex items-center justify-center space-x-2">
                            <Sprout className="w-4 h-4" />
                            <span>Plant Seed</span>
                        </span>
                    </button>
                </form>
            </div>
        </div>
    );
}
