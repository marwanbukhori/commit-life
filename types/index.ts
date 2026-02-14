export interface Pet {
    id: string;
    name: string;
    stage: 'egg' | 'baby' | 'toddler' | 'child' | 'teen' | 'adult';
    level: number;
    xp: number;
    xpToNextLevel: number;
    color: string;
    species: string;
    type: 'ANIMAL' | 'PLANT';
    rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
}

export interface Pillar {
    id: string;
    userId?: string;
    name: string;
    description: string;
    color: string;
    pet: Pet;
    totalCommits: number;
}

export interface Habit {
    id: string;
    pillarId: string;
    name: string;
    frequency: 'daily' | 'weekly';
    completedToday: boolean;
    streak: number;
    lastRemark?: string | null;
}
