"use client";

import React, { useState } from "react";
import { X, Lock, Sprout, Egg } from "lucide-react";
import { PetSprite } from '@/components/ui/PetSprite';

interface CreatePillarModalProps {
    isOpen: boolean;
    isPremium?: boolean;
    onClose: () => void;
    onSubmit: (name: string, description: string, color: string, companionSpecies: string, companionName?: string) => void;
}

const COLORS = [
    "#ef4444", // red
    "#f97316", // orange
    "#eab308", // yellow
    "#10b981", // emerald
    "#06b6d4", // cyan
    "#3b82f6", // blue
    "#8b5cf6", // violet
    "#d946ef", // fuchsia
];

const COMPANIONS = [
    { id: 'Chicken', name: 'Chicken', type: 'Animal', premium: false, desc: 'A loyal farm friend.' },
    { id: 'Sunflower', name: 'Sunflower', type: 'Plant', premium: false, desc: 'Bright and sunny.' },
    { id: 'Dragon', name: 'Dragon', type: 'Animal', premium: true, desc: 'Mythical power.' },
    { id: 'CrystalTree', name: 'Crystal Tree', type: 'Plant', premium: true, desc: 'Mystical energy.' },
];

export function CreatePillarModal({ isOpen, isPremium = false, onClose, onSubmit }: CreatePillarModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [companionName, setCompanionName] = useState("");
    const [color, setColor] = useState(COLORS[3]); // Default emerald
    const [species, setSpecies] = useState("Chicken");

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(name, description, color, species, companionName);
        setName("");
        setDescription("");
        setCompanionName("");
        setColor(COLORS[3]);
        setSpecies("Chicken");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />
            <div className="relative bg-amber-950 border-4 border-amber-800 w-full max-w-lg z-10 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 bg-amber-900 border-b-4 border-amber-800">
                    <h2 className="text-lg text-amber-100 uppercase tracking-widest font-bold" style={{ textShadow: "2px 2px 0 #000" }}>
                        Plant New Garden
                    </h2>
                    <button onClick={onClose} className="text-amber-400/50 hover:text-amber-100 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-amber-400/50 mb-1 font-bold">Garden Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-amber-950/80 border-b-4 border-amber-800 px-2 py-2 text-amber-100 text-lg placeholder-amber-700/50 focus:outline-none focus:border-green-600 transition-colors"
                                placeholder="e.g. Morning Workout"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-amber-400/50 mb-1 font-bold">Description</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-amber-950/80 border-b-4 border-amber-800 px-2 py-2 text-amber-100 text-sm placeholder-amber-700/50 focus:outline-none focus:border-green-600 transition-colors"
                                placeholder="Optional goal..."
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-amber-400/50 mb-1 font-bold">Companion Name <span className="text-amber-600/40 text-[9px]">(Optional)</span></label>
                            <input
                                type="text"
                                value={companionName}
                                onChange={(e) => setCompanionName(e.target.value)}
                                className="w-full bg-amber-950/80 border-b-4 border-amber-800 px-2 py-2 text-amber-100 text-sm placeholder-amber-700/50 focus:outline-none focus:border-green-600 transition-colors"
                                placeholder="Defaults to Species Name"
                            />
                        </div>
                    </div>

                    {/* Color Selection */}
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-amber-400/50 mb-2 font-bold">Theme Color</label>
                        <div className="flex flex-wrap gap-3">
                            {COLORS.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setColor(c)}
                                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? 'border-white scale-110 ring-2 ring-white/20' : 'border-transparent'}`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Companion Selection */}
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-amber-400/50 mb-3 font-bold">
                            Choose Companion <span className="text-amber-600/50 ml-2">(Cannot be changed later)</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {COMPANIONS.map((comp) => {
                                const locked = comp.premium && !isPremium;
                                const isSelected = species === comp.id;

                                return (
                                    <button
                                        key={comp.id}
                                        type="button"
                                        onClick={() => !locked && setSpecies(comp.id)}
                                        disabled={locked}
                                        className={`relative flex items-center p-3 border-4 transition-all text-left group
                                            ${isSelected
                                                ? 'border-green-500 bg-green-900/20'
                                                : locked
                                                    ? 'border-amber-900/30 bg-black/20 opacity-60 cursor-not-allowed'
                                                    : 'border-amber-800 bg-amber-950/40 hover:border-amber-600 hover:bg-amber-900/40'
                                            }
                                        `}
                                    >
                                        <div className="flex-shrink-0 mr-3 filter drop-shadow-lg scale-75 origin-left">
                                            <PetSprite
                                                species={comp.id}
                                                stage="adult" // Preview as adult
                                                className="w-16 h-16" // Slightly larger for clarity
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-xs font-bold text-amber-100 uppercase tracking-wide flex items-center">
                                                <span className="truncate">{comp.name}</span>
                                                {locked && <Lock className="w-3 h-3 ml-1 text-amber-500 flex-shrink-0" />}
                                            </div>
                                            <div className="text-[10px] text-amber-400/50 truncate">{comp.desc}</div>
                                        </div>

                                        {/* Background highlight for selected */}
                                        {isSelected && (
                                            <div className="absolute inset-0 border-2 border-green-400/30 pointer-events-none animate-pulse-slow" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={!name}
                        className="w-full py-4 bg-green-700 border-b-4 border-green-950 text-white text-sm font-bold uppercase tracking-widest hover:bg-green-600 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        Plant Garden
                    </button>
                </form>
            </div>
        </div>
    );
}
