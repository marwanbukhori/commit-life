import { Pet } from "@/types";

// XP thresholds for each level
const XP_PER_COMMIT = 25;

// Level thresholds: level -> xp needed to reach NEXT level
const LEVEL_THRESHOLDS: Record<number, number> = {
    1: 100,
    2: 200,
    3: 350,
    4: 500,
    5: 750,
    6: 1000,
    7: 1500,
    8: 2000,
    9: 3000,
    10: 5000,
};

// Stage thresholds: at what level does the pet evolve?
const STAGE_THRESHOLDS: { level: number; stage: Pet["stage"] }[] = [
    { level: 1, stage: "egg" },
    { level: 2, stage: "baby" },
    { level: 4, stage: "toddler" },
    { level: 6, stage: "child" },
    { level: 9, stage: "teen" },
    { level: 12, stage: "adult" },
];

export const petService = {
    /**
     * Calculate updated pet stats after a commit.
     * Returns the new Pet object (does NOT write to DB).
     */
    addXP: (pet: Pet, commits: number = 1): Pet => {
        let xp = pet.xp + XP_PER_COMMIT * commits;
        let level = pet.level;
        let xpToNextLevel = pet.xpToNextLevel;
        let stage = pet.stage;

        // Level-up loop
        while (xp >= xpToNextLevel) {
            xp -= xpToNextLevel;
            level += 1;
            xpToNextLevel = LEVEL_THRESHOLDS[level] || xpToNextLevel + 500; // Fallback for high levels
        }

        // Check evolution
        for (const threshold of STAGE_THRESHOLDS) {
            if (level >= threshold.level) {
                stage = threshold.stage;
            }
        }

        return {
            ...pet,
            xp,
            level,
            xpToNextLevel,
            stage,
        };
    },

    /** Get XP earned per commit */
    getXPPerCommit: () => XP_PER_COMMIT,

    /** Get the next evolution stage info */
    getNextEvolution: (pet: Pet): { stage: Pet["stage"]; levelsAway: number } | null => {
        const currentStageIndex = STAGE_THRESHOLDS.findIndex((t) => t.stage === pet.stage);
        const nextStage = STAGE_THRESHOLDS[currentStageIndex + 1];
        if (!nextStage) return null; // Already at max stage
        return {
            stage: nextStage.stage,
            levelsAway: nextStage.level - pet.level,
        };
    },
};
