import { actionsApi, habitsApi, pillarsApi } from "@/lib/api";
import { Action, Habit, Pillar, PillarWithHabits } from "@/lib/types";
import { create } from "zustand";

interface AppState {
  pillars: PillarWithHabits[];
  selectedPillar: Pillar | null;
  todayActions: Action[];
  loading: boolean;
  error: string | null;

  // Data loading actions
  loadPillars: () => Promise<void>;
  loadTodayActions: () => Promise<void>;
  refreshData: () => Promise<void>;

  // Pillar actions
  addPillar: (
    pillar: Omit<Pillar, "id" | "created_at" | "user_id">
  ) => Promise<void>;
  updatePillar: (id: string, updates: Partial<Pillar>) => Promise<void>;
  deletePillar: (pillarId: string) => Promise<void>;
  setSelectedPillar: (pillar: Pillar | null) => void;

  // Habit actions
  addHabit: (
    habit: Omit<Habit, "id" | "created_at" | "user_id">
  ) => Promise<void>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;

  // Action actions
  addAction: (
    action: Omit<Action, "id" | "created_at" | "user_id">
  ) => Promise<void>;
  removeAction: (habitId: string, date: string) => Promise<void>;

  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  pillars: [],
  selectedPillar: null,
  todayActions: [],
  loading: false,
  error: null,

  // Data loading actions
  loadPillars: async () => {
    try {
      set({ loading: true, error: null });
      const pillars = await pillarsApi.getAll();
      set({ pillars, loading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load pillars";
      set({ error: errorMessage, loading: false });
      console.error("Error loading pillars:", error);
    }
  },

  loadTodayActions: async () => {
    try {
      set({ error: null });
      const actions = await actionsApi.getTodayActions();
      set({ todayActions: actions });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load today's actions";
      set({ error: errorMessage });
      console.error("Error loading today's actions:", error);
    }
  },

  refreshData: async () => {
    // Check if we have authentication before loading data
    try {
      const {
        data: { user },
      } = await import("@/lib/supabase").then((m) => m.supabase.auth.getUser());
      if (!user) {
        // User not authenticated, don't try to load data
        return;
      }

      const { loadPillars, loadTodayActions } = get();
      await Promise.all([loadPillars(), loadTodayActions()]);
    } catch (error) {
      console.error("Error checking authentication:", error);
      // Don't try to load data if auth check fails
    }
  },

  // Pillar actions
  addPillar: async (pillarData) => {
    try {
      set({ loading: true, error: null });
      const newPillar = await pillarsApi.create(pillarData);
      set((state) => ({
        pillars: [...state.pillars, { ...newPillar, habits: [] }],
        loading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create pillar";
      set({ error: errorMessage, loading: false });
      console.error("Error creating pillar:", error);
      throw error;
    }
  },

  updatePillar: async (id, updates) => {
    try {
      set({ error: null });
      const updatedPillar = await pillarsApi.update(id, updates);
      set((state) => ({
        pillars: state.pillars.map((p) =>
          p.id === id ? { ...p, ...updatedPillar } : p
        ),
        selectedPillar:
          state.selectedPillar?.id === id
            ? { ...state.selectedPillar, ...updatedPillar }
            : state.selectedPillar,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update pillar";
      set({ error: errorMessage });
      console.error("Error updating pillar:", error);
      throw error;
    }
  },

  deletePillar: async (pillarId) => {
    try {
      set({ error: null });
      await pillarsApi.delete(pillarId);
      set((state) => ({
        pillars: state.pillars.filter((p) => p.id !== pillarId),
        selectedPillar:
          state.selectedPillar?.id === pillarId ? null : state.selectedPillar,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete pillar";
      set({ error: errorMessage });
      console.error("Error deleting pillar:", error);
      throw error;
    }
  },

  setSelectedPillar: (pillar) => set({ selectedPillar: pillar }),

  // Habit actions
  addHabit: async (habitData) => {
    try {
      set({ error: null });
      const newHabit = await habitsApi.create(habitData);
      set((state) => ({
        pillars: state.pillars.map((p) =>
          p.id === habitData.pillar_id
            ? { ...p, habits: [...p.habits, newHabit] }
            : p
        ),
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create habit";
      set({ error: errorMessage });
      console.error("Error creating habit:", error);
      throw error;
    }
  },

  updateHabit: async (id, updates) => {
    try {
      set({ error: null });
      const updatedHabit = await habitsApi.update(id, updates);
      set((state) => ({
        pillars: state.pillars.map((p) => ({
          ...p,
          habits: p.habits.map((h) => (h.id === id ? updatedHabit : h)),
        })),
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update habit";
      set({ error: errorMessage });
      console.error("Error updating habit:", error);
      throw error;
    }
  },

  deleteHabit: async (habitId) => {
    try {
      set({ error: null });
      await habitsApi.delete(habitId);
      set((state) => ({
        pillars: state.pillars.map((p) => ({
          ...p,
          habits: p.habits.filter((h) => h.id !== habitId),
        })),
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete habit";
      set({ error: errorMessage });
      console.error("Error deleting habit:", error);
      throw error;
    }
  },

  // Action actions
  addAction: async (actionData) => {
    try {
      set({ error: null });
      const newAction = await actionsApi.create(actionData);
      set((state) => ({
        todayActions: [...state.todayActions, newAction],
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to commit habit";
      set({ error: errorMessage });
      console.error("Error creating action:", error);
      throw error;
    }
  },

  removeAction: async (habitId, date) => {
    try {
      set({ error: null });
      // Remove from database (we'll need to add this API function)
      await actionsApi.remove(habitId, date);
      // Remove from local state
      set((state) => ({
        todayActions: state.todayActions.filter(
          (action) => !(action.habit_id === habitId && action.date === date)
        ),
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to remove action";
      set({ error: errorMessage });
      console.error("Error removing action:", error);
      throw error;
    }
  },

  // Utility actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
