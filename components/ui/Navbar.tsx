"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Sprout, LogIn, LogOut, HelpCircle, Shield, Crown } from 'lucide-react';
import { useSession, signIn, signOut } from "next-auth/react";
import { FAQModal } from './FAQModal';

export function Navbar() {
    const { data: session } = useSession();
    const user = session?.user;
    const [menuOpen, setMenuOpen] = useState(false);
    const [faqOpen, setFaqOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-amber-950/95 border-b-4 border-amber-900/60 backdrop-blur-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-3 group">
                    <div className="w-10 h-10 bg-amber-900 border-4 border-amber-950 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Sprout className="w-6 h-6 text-green-400" />
                    </div>
                    <span className="text-lg text-amber-100 font-bold uppercase tracking-widest" style={{ textShadow: '2px 2px 0 #000' }}>
                        Commit<span className="text-green-400">Garden</span>
                    </span>
                </Link>

                <div className="flex items-center space-x-3 md:space-x-6">
                    {user ? (
                        <div className="flex items-center space-x-4">
                            {/* Visible Premium CTA */}
                            {!(session.user as any).isPremium && (
                                <Link
                                    href="/upgrade"
                                    className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black px-3 py-1.5 rounded-full font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-yellow-900/20 active:scale-95 transition-all animate-pulse"
                                >
                                    <Crown className="w-3 h-3" />
                                    <span>Get Premium</span>
                                </Link>
                            )}

                            {/* PRO Badge */}
                            {(user as any).isPremium && (
                                <div className="hidden md:flex items-center space-x-1 bg-gradient-to-r from-purple-900/80 to-indigo-900/80 border border-purple-500/30 px-3 py-1 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                                    <Crown className="w-3 h-3 text-purple-400" />
                                    <span className="text-[10px] font-bold text-purple-200 uppercase tracking-widest">PRO</span>
                                </div>
                            )}

                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="w-10 h-10 bg-amber-900 border-b-4 border-amber-950 flex items-center justify-center hover:bg-amber-800 active:border-b-0 active:translate-y-1 transition-all overflow-hidden"
                                    title={user.name || "Profile"}
                                >
                                    {user.image ? (
                                        <img
                                            src={user.image}
                                            alt={user.name || "User"}
                                            className="w-full h-full object-cover"
                                            referrerPolicy="no-referrer"
                                        />
                                    ) : (
                                        <div className="w-6 h-6 bg-yellow-500 border-2 border-yellow-700" />
                                    )}
                                </button>

                                {menuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-amber-900 border-4 border-amber-800 shadow-2xl z-50 animate-in slide-in-from-top-2 duration-200">
                                        <div className="px-4 py-3 border-b-2 border-amber-800/50 bg-black/20">
                                            <div className="flex justify-between items-center">
                                                <p className="text-[10px] text-amber-500 uppercase tracking-widest font-bold">Farmer</p>
                                                {(user as any).isPremium && (
                                                    <span className="text-[10px] bg-purple-900/80 border border-purple-500/30 text-purple-200 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest shadow-sm">
                                                        PRO
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-amber-100 font-bold truncate mt-1">{user.name}</p>
                                            <p className="text-[10px] text-amber-400/40 truncate font-mono">{user.email}</p>
                                        </div>

                                        <div className="py-2 px-2 space-y-1">
                                            {/* Premium Link (Only if not premium) */}
                                            {!(user as any).isPremium && (
                                                <Link
                                                    href="/upgrade"
                                                    onClick={() => setMenuOpen(false)}
                                                    className="w-full flex items-center space-x-3 px-4 py-3 text-xs text-yellow-300 bg-yellow-900/20 hover:bg-yellow-900/40 hover:text-yellow-200 transition-colors uppercase tracking-widest font-bold group border border-yellow-800/30 rounded mb-2"
                                                >
                                                    <Crown className="w-4 h-4 group-hover:scale-110 transition-transform text-yellow-500" />
                                                    <span>Get Premium</span>
                                                </Link>
                                            )}

                                            <Link
                                                href="/profile"
                                                onClick={() => setMenuOpen(false)}
                                                className="w-full flex items-center space-x-3 px-4 py-3 text-xs text-amber-200 hover:bg-amber-800 hover:text-green-400 transition-colors uppercase tracking-widest font-bold group"
                                            >
                                                <Sprout className="w-4 h-4 group-hover:animate-bounce" />
                                                <span>My Garden</span>
                                            </Link>

                                            <button
                                                onClick={() => { setFaqOpen(true); setMenuOpen(false); }}
                                                className="w-full flex items-center space-x-3 px-4 py-3 text-xs text-amber-200 hover:bg-amber-800 hover:text-yellow-400 transition-colors uppercase tracking-widest font-bold group"
                                            >
                                                <HelpCircle className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                                <span>Almanac (FAQ)</span>
                                            </button>

                                            <Link
                                                href="/web"
                                                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-amber-900/50 transition-colors text-left text-sm font-bold text-amber-200/80 hover:text-amber-100"
                                                onClick={() => setMenuOpen(false)}
                                            >
                                                <Sprout className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                                <span>About CommitGarden</span>
                                            </Link>

                                            {/* Admin Link */}
                                            {(user as any).role === 'ADMIN' && (
                                                <Link
                                                    href="/admin"
                                                    onClick={() => setMenuOpen(false)}
                                                    className="w-full flex items-center space-x-3 px-4 py-3 text-xs text-red-300 hover:bg-red-900/30 hover:text-red-200 transition-colors uppercase tracking-widest font-bold group border-t border-amber-800/50"
                                                >
                                                    <Shield className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                    <span>Overwatch</span>
                                                </Link>
                                            )}
                                        </div>

                                        <div className="border-t-2 border-amber-800/50 pt-1">
                                            <button
                                                onClick={() => { signOut({ callbackUrl: '/' }); setMenuOpen(false); }}
                                                className="w-full flex items-center space-x-3 px-4 py-3 text-xs text-amber-200/70 hover:bg-red-900/40 hover:text-red-400 transition-colors uppercase tracking-widest font-bold"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => signIn("google")}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-700 border-b-4 border-green-950 hover:bg-green-600 active:border-b-0 active:translate-y-1 transition-all text-xs font-bold uppercase text-white shadow-lg shadow-green-900/50"
                        >
                            <LogIn className="w-4 h-4" />
                            <span>Sign In</span>
                        </button>
                    )}
                </div>

            </div>

            {/* FAQ Modal */}
            <FAQModal isOpen={faqOpen} onClose={() => setFaqOpen(false)} />
        </nav>
    );
}
