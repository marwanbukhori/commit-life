import { samplePillars } from "@/lib/sample-data";
import { Action, Habit, Pillar, PillarWithHabits } from "@/lib/types";
import { create } from "zustand";

interface AppState {
  pillars: PillarWithHabits[];
  selectedPillar: Pillar | null;
  todayActions: Action[];
  loading: boolean;

  // Actions
  setPillars: (pillars: PillarWithHabits[]) => void;
  setSelectedPillar: (pillar: Pillar | null) => void;
  addPillar: (pillar: Pillar) => void;
  updatePillar: (pillar: Pillar) => void;
  deletePillar: (pillarId: string) => void;

  addHabit: (habit: Habit) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (habitId: string) => void;

  addAction: (action: Action) => void;
  setTodayActions: (actions: Action[]) => void;

  setLoading: (loading: boolean) => void;
  loadSampleData: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  pillars: [],
  selectedPillar: null,
  todayActions: [],
  loading: false,

  setPillars: (pillars) => set({ pillars }),

  setSelectedPillar: (pillar) => set({ selectedPillar: pillar }),

  addPillar: (pillar) =>
    set((state) => ({
      pillars: [...state.pillars, { ...pillar, habits: [] }],
    })),

  updatePillar: (pillar) =>
    set((state) => ({
      pillars: state.pillars.map((p) =>
        p.id === pillar.id ? { ...p, ...pillar } : p
      ),
    })),

  deletePillar: (pillarId) =>
    set((state) => ({
      pillars: state.pillars.filter((p) => p.id !== pillarId),
      selectedPillar:
        state.selectedPillar?.id === pillarId ? null : state.selectedPillar,
    })),

  addHabit: (habit) =>
    set((state) => ({
      pillars: state.pillars.map((p) =>
        p.id === habit.pillar_id ? { ...p, habits: [...p.habits, habit] } : p
      ),
    })),

  updateHabit: (habit) =>
    set((state) => ({
      pillars: state.pillars.map((p) =>
        p.id === habit.pillar_id
          ? {
              ...p,
              habits: p.habits.map((h) => (h.id === habit.id ? habit : h)),
            }
          : p
      ),
    })),

  deleteHabit: (habitId) =>
    set((state) => ({
      pillars: state.pillars.map((p) => ({
        ...p,
        habits: p.habits.filter((h) => h.id !== habitId),
      })),
    })),

  addAction: (action) =>
    set((state) => ({
      todayActions: [...state.todayActions, action],
    })),

  setTodayActions: (actions) => set({ todayActions: actions }),

  setLoading: (loading) => set({ loading }),

  loadSampleData: () => set({ pillars: samplePillars }),
}));
