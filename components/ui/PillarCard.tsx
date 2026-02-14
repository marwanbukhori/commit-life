import React from 'react';
import Link from 'next/link';
import { Pillar } from '@/types';
import { PetDisplay } from './PetDisplay';
import { PetSprite } from './PetSprite';
import { ArrowRight } from 'lucide-react';

interface PillarCardProps {
    pillar: Pillar;
}

export function PillarCard({ pillar }: PillarCardProps) {
    return (
        <Link
            href={`/pillars/${pillar.id}`}
            className="group relative block bg-amber-950/60 border-4 border-amber-900/50 hover:border-green-600/70 transition-all duration-200"
            style={{ imageRendering: 'pixelated' }}
        >
            {/* Inner Border (Simulated Depth) */}
            <div className="absolute inset-0 border-b-4 border-r-4 border-amber-950 pointer-events-none opacity-40" />

            <div className="p-6 relative z-10">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-xl text-amber-100 mb-2 leading-tight" style={{ color: pillar.color, textShadow: '2px 2px 0px #000' }}>
                            {pillar.name}
                        </h3>
                        <p className="text-xs text-amber-400/40 mb-4 font-thin leading-relaxed max-w-[200px]">{pillar.description}</p>

                        <div className="inline-flex items-center space-x-2 px-2 py-1 bg-amber-950/80 border-2 border-amber-900/60">
                            <div className="w-2 h-2" style={{ backgroundColor: pillar.color }} />
                            <span className="text-[10px] text-amber-300/60 uppercase tracking-widest">{pillar.totalCommits} harvests</span>
                        </div>
                    </div>

                    <div className="bg-amber-950/80 p-2 border-2 border-amber-900/50 min-w-[60px] flex flex-col items-center justify-center">
                        {pillar.pet ? (
                            <>
                                <PetSprite species={pillar.pet.species} stage={pillar.pet.stage} className="w-10 h-10 mb-1" />
                                <div className="bg-black/40 px-1.5 py-0.5 rounded border border-amber-900/50 relative z-10">
                                    <div className="text-[9px] text-amber-500 font-bold uppercase tracking-widest leading-none">
                                        Lv {pillar.pet.level || 1}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="w-8 h-8 flex items-center justify-center text-xs text-amber-700/50">🌱</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Area footer */}
            <div className="px-6 py-3 bg-amber-950/80 border-t-4 border-amber-900/40 flex items-center justify-between group-hover:bg-amber-900/40 transition-colors">
                <span className="text-[10px] uppercase text-amber-600/50 group-hover:text-green-400">Visit Garden</span>
                <ArrowRight className="w-4 h-4 text-amber-600/50 group-hover:text-green-400" />
            </div>
        </Link>
    );
}
