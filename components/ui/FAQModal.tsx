"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, HelpCircle, BookOpen } from "lucide-react";

interface FAQModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FAQS = [
    {
        q: "What is a Pillar?",
        a: "A Pillar represents a core area of your life you want to improve (e.g., Health, Learning). It acts as a garden in which your habits grow."
    },
    {
        q: "How do I grow my Garden?",
        a: "Each Pillar contains a Companion (Pet/Plant). Completing habits (Commits) gives XP to your companion. As they level up, they evolve!"
    },
    {
        q: "What is a Commit?",
        a: "A 'Commit' is the act of completing a scheduled habit. It's like watering your plants or feeding your pet."
    },
    {
        q: "How does Evolution work?",
        a: "Companions evolve at specific level milestones (e.g., Lv 10, Lv 30). They change appearance from Egg -> Baby -> Adult -> Ancient."
    },
    {
        q: "What happens if I miss a day?",
        a: "Consistency is key! Missing a day might reset your streak, but your companion won't die. They just get lonely."
    },
    {
        q: "What is the global leaderboard?",
        a: "Coming soon! Compete with other farmers to see whose garden is flourishing the most."
    }
];

const GLOSSARY = [
    { term: "XP", def: "Experience Points. Earned by completing habits." },
    { term: "Streak", def: "Consecutive days of completing at least one habit." },
    { term: "Companion", def: "Your digital pet that grows with your habits." }
];

export function FAQModal({ isOpen, onClose }: FAQModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    // Use portal to render outside the styled/transformed parent hierarchy
    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />
            <div className="relative bg-amber-950 border-4 border-amber-800 w-full max-w-2xl z-10 max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-300">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-amber-900 border-b-4 border-amber-800 shrink-0">
                    <div className="flex items-center space-x-3">
                        <BookOpen className="w-6 h-6 text-amber-200" />
                        <h2 className="text-xl text-amber-100 uppercase tracking-widest font-bold" style={{ textShadow: "2px 2px 0 #000" }}>
                            Farmer's Almanac
                        </h2>
                    </div>
                    <button onClick={onClose} className="text-amber-400/50 hover:text-red-400 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

                    {/* Glossary Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest border-b-2 border-amber-800/50 pb-2 mb-4">
                            Terminology
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {GLOSSARY.map((item) => (
                                <div key={item.term} className="bg-black/20 p-3 border-2 border-amber-900/40 rounded-sm">
                                    <div className="text-green-400 font-bold text-xs uppercase mb-1">{item.term}</div>
                                    <div className="text-amber-100/70 text-xs leading-relaxed">{item.def}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest border-b-2 border-amber-800/50 pb-2 mb-4">
                            Frequently Asked Questions
                        </h3>
                        <div className="space-y-4">
                            {FAQS.map((faq, i) => (
                                <div key={i} className="group">
                                    <div className="flex items-start space-x-3">
                                        <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 group-hover:text-green-500 transition-colors" />
                                        <div>
                                            <h4 className="text-amber-100 font-bold text-sm mb-1 group-hover:text-green-200 transition-colors">
                                                {faq.q}
                                            </h4>
                                            <p className="text-amber-200/60 text-xs leading-relaxed">
                                                {faq.a}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="bg-amber-900/50 p-4 text-center text-[10px] text-amber-500 uppercase tracking-widest border-t-4 border-amber-800">
                    Keep Growing! 🌱
                </div>
            </div>
        </div>,
        document.body // Portal Target
    );
}
