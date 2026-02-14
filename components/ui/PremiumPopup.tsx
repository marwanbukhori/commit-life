"use client";

import React from 'react';
import { X, Crown } from 'lucide-react';
import Link from 'next/link';

interface PremiumPopupProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
}

export function PremiumPopup({ isOpen, onClose, title = "Unlock Premium Features", message = "Upgrade to unlock more realms and features." }: PremiumPopupProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />
            <div className="relative bg-amber-950 border-4 border-amber-800 w-full max-w-sm z-10 text-center animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 bg-amber-900 border-b-4 border-amber-800 flex justify-between items-center">
                    <h2 className="text-lg text-amber-100 uppercase tracking-widest font-bold flex items-center gap-2" style={{ textShadow: "2px 2px 0 #000" }}>
                        <Crown className="w-5 h-5 text-yellow-500" />
                        Premium Required
                    </h2>
                    <button onClick={onClose} className="text-amber-400/50 hover:text-amber-100 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-8 space-y-6">
                    <div className="w-20 h-20 mx-auto bg-amber-900/50 border-4 border-amber-800 flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-yellow-500/10 animate-pulse" />
                        <Crown className="w-10 h-10 text-yellow-500 drop-shadow-lg" />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-amber-100 font-bold uppercase tracking-wide">{title}</h3>
                        <p className="text-amber-300/60 text-sm leading-relaxed px-4">
                            {message}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Link
                            href="/upgrade"
                            onClick={onClose}
                            className="w-full flex items-center justify-center space-x-2 py-4 bg-gradient-to-r from-yellow-600 to-yellow-500 border-b-4 border-yellow-800 text-black text-sm font-bold uppercase tracking-widest hover:from-yellow-500 hover:to-yellow-400 active:border-b-0 active:translate-y-1 transition-all shadow-lg shadow-yellow-900/20"
                        >
                            <Crown className="w-4 h-4" />
                            <span>Upgrade Now</span>
                        </Link>
                        <button
                            onClick={onClose}
                            className="text-amber-600/50 text-xs uppercase tracking-widest hover:text-amber-300 transition-colors"
                        >
                            Maybe Later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
