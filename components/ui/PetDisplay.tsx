"use client";

import React from 'react';
import { Pet } from '@/types';
import { cn } from '@/lib/utils';

interface PetDisplayProps {
    pet: Pet;
    className?: string; // Additional classes
}

// Maps and logic moved to PetSprite component
import { PetSprite } from '@/components/ui/PetSprite';

export function PetDisplay({ pet, className }: PetDisplayProps) {
    const species = pet.species || 'Chicken';
    // Normalize stage name
    const stage = pet.stage || 'baby';

    // Special effects for Premium/Rare pets
    const isCrystal = species === 'CrystalTree';
    const isDragon = species === 'Dragon';

    return (
        <div className={cn("relative flex flex-col items-center justify-center", className)}>
            {/* Glow Effect behind pet */}
            <div
                className={cn(
                    "absolute w-24 h-24 rounded-full blur-xl opacity-40 animate-pulse-slow",
                    isCrystal ? "bg-cyan-400" : isDragon ? "bg-purple-500" : "bg-yellow-400"
                )}
            />

            {/* The Pet Sprite */}
            <PetSprite
                species={species}
                stage={pet.stage}
                className={cn(
                    "w-32 h-32 transition-transform duration-500 hover:scale-110",
                    "filter drop-shadow-2xl animate-bounce-slow"
                )}
            />

            {/* Rarity sparkles/text, optional but helpful for debugging */}
            <div className="sr-only">
                {species} - {stage}
            </div>

            {/* Rarity Star for Premium */}
            {(pet.rarity === 'LEGENDARY' || pet.rarity === 'EPIC') && (
                <div className="absolute -top-2 -right-2 text-2xl animate-spin-slow">
                    ✨
                </div>
            )}
        </div>
    );
}
