"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface PetSpriteProps {
    species: string;
    stage: string;
    className?: string;
}

// Map species to image filenames
const SPECIES_IMG: Record<string, Record<string, string>> = {
    'Chicken': {
        'egg': '/companions/chicken/egg.png',
        'baby': '/companions/chicken/baby.png',
        'adult': '/companions/chicken/adult.png',
        'ancient': '/companions/chicken/ancient.png',
    },
    'Sunflower': {
        'egg': '/companions/sunflower/seed.png',
        'baby': '/companions/sunflower/sprout.png',
        'adult': '/companions/sunflower/bloom.png',
        'ancient': '/companions/sunflower/ancient.png',
    },
    'Dragon': {
        'egg': '/companions/dragon/egg.png',
        'baby': '/companions/dragon/baby.png',
        'adult': '/companions/dragon/adult.png',
        'ancient': '/companions/dragon/ancient.png',
    },
    'CrystalTree': {
        'egg': '/companions/crystaltree/egg.png',
        'baby': '/companions/crystaltree/baby.png',
        'adult': '/companions/crystaltree/adult.png',
        'ancient': '/companions/crystaltree/ancient.png',
    },
};

export function PetSprite({ species, stage, className }: PetSpriteProps) {
    const lowerStage = stage.toLowerCase();

    // Determine canonical stage key
    let canonicalStage = 'baby';

    // Stage normalization logic (Check highest stage first to avoid partial matches like 'Tree' in 'Guardian Tree')
    if (lowerStage.includes('ancient') || lowerStage.includes('giant') || lowerStage.includes('elder') || lowerStage.includes('guardian')) {
        canonicalStage = 'ancient';
    } else if (lowerStage.includes('adult') || lowerStage.includes('bloom') || lowerStage.includes('teen') || lowerStage.includes('tree')) {
        canonicalStage = 'adult';
    } else if (lowerStage.includes('baby') || lowerStage.includes('sprout') || lowerStage.includes('chick') || lowerStage.includes('toddler') || lowerStage.includes('whelp') || lowerStage.includes('sapling')) {
        canonicalStage = 'baby';
    } else if (lowerStage.includes('egg') || lowerStage.includes('seed') || lowerStage.includes('shard')) {
        canonicalStage = 'egg';
    }

    // Default to Chicken if species unknown
    const config = SPECIES_IMG[species] || SPECIES_IMG['Chicken'];

    // Get specific file, fallback to baby or egg or adult if specific stage missing
    const file = config[canonicalStage] || config['baby'] || config['adult'] || '/companions/chicken/baby.png';

    return (
        <div
            className={cn(
                "image-pixelated bg-no-repeat transition-transform duration-300",
                "bg-white/90 rounded-full border-4 border-amber-900/40 shadow-xl", // Token style
                "overflow-hidden shrink-0",
                className
            )}
            style={{
                backgroundImage: `url(${file})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                imageRendering: 'pixelated'
            }}
            aria-label={`${species} ${stage}`}
        />
    );
}
