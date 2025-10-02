import { supabase } from "./supabase";
import { Action, Habit, Pillar, PillarWithHabits } from "./types";

// Error handling helper
const handleSupabaseError = (error: any, operation: string) => {
  console.error(`Supabase ${operation} error:`, error);
  throw new Error(`Failed to ${operation}: ${error.message}`);
};

// Get current user helper
const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw error;
  if (!user) throw new Error("User not authenticated");
  return user;
};

// This function can be used later for authentication checks if needed
// const isUserAuthenticated = async () => {
//   try {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     return !!user;
//   } catch {
//     return false;
//   }
// };

// Profile API functions
export const profileApi = {
  async getProfile() {
    const user = await getCurrentUser();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned
      handleSupabaseError(error, "get profile");
    }
    return data;
  },

  async updateProfile(updates: { full_name?: string; avatar_url?: string }) {
    const user = await getCurrentUser();
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    if (error) handleSupabaseError(error, "update profile");
    return data;
  },
};

// Pillar API functions
export const pillarsApi = {
  async getAll(): Promise<PillarWithHabits[]> {
    const user = await getCurrentUser();
    const { data, error } = await supabase
      .from("pillars")
      .select(
        `
        *,
        habits (*)
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) handleSupabaseError(error, "get pillars");
    return data || [];
  },

  async create(
    pillar: Omit<Pillar, "id" | "created_at" | "user_id">
  ): Promise<Pillar> {
    const user = await getCurrentUser();
    const pillarWithUser = { ...pillar, user_id: user.id };
    const { data, error } = await supabase
      .from("pillars")
      .insert([pillarWithUser])
      .select()
      .single();

    if (error) handleSupabaseError(error, "create pillar");
    return data;
  },

  async update(id: string, updates: Partial<Pillar>): Promise<Pillar> {
    const user = await getCurrentUser();
    const { data, error } = await supabase
      .from("pillars")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) handleSupabaseError(error, "update pillar");
    return data;
  },

  async delete(id: string): Promise<void> {
    const user = await getCurrentUser();
    const { error } = await supabase
      .from("pillars")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) handleSupabaseError(error, "delete pillar");
  },
};

// Habit API functions
export const habitsApi = {
  async create(
    habit: Omit<Habit, "id" | "created_at" | "user_id">
  ): Promise<Habit> {
    const user = await getCurrentUser();
    const habitWithUser = { ...habit, user_id: user.id };
    const { data, error } = await supabase
      .from("habits")
      .insert([habitWithUser])
      .select()
      .single();

    if (error) handleSupabaseError(error, "create habit");
    return data;
  },

  async update(id: string, updates: Partial<Habit>): Promise<Habit> {
    const user = await getCurrentUser();
    const { data, error } = await supabase
      .from("habits")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) handleSupabaseError(error, "update habit");
    return data;
  },

  async delete(id: string): Promise<void> {
    const user = await getCurrentUser();
    const { error } = await supabase
      .from("habits")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) handleSupabaseError(error, "delete habit");
  },
};

// Action API functions
export const actionsApi = {
  async getTodayActions(): Promise<Action[]> {
    const user = await getCurrentUser();
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("actions")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", today)
      .order("created_at", { ascending: false });

    if (error) handleSupabaseError(error, "get today actions");
    return data || [];
  },

  async create(
    action: Omit<Action, "id" | "created_at" | "user_id">
  ): Promise<Action> {
    const user = await getCurrentUser();
    const actionWithUser = { ...action, user_id: user.id };
    const { data, error } = await supabase
      .from("actions")
      .insert([actionWithUser])
      .select()
      .single();

    if (error) handleSupabaseError(error, "create action");
    return data;
  },

  async remove(habitId: string, date: string): Promise<void> {
    const user = await getCurrentUser();
    const { error } = await supabase
      .from("actions")
      .delete()
      .eq("habit_id", habitId)
      .eq("user_id", user.id)
      .eq("date", date);

    if (error) handleSupabaseError(error, "remove action");
  },

  async getHeatmapData(
    startDate: string,
    endDate: string,
    pillarId?: string
  ): Promise<{ date: string; count: number }[]> {
    const user = await getCurrentUser();
    let data, error;

    if (pillarId) {
      // Join with habits to filter by pillar
      const result = await supabase
        .from("actions")
        .select(
          `
          date,
          habits!inner(pillar_id)
        `
        )
        .eq("user_id", user.id)
        .eq("habits.pillar_id", pillarId)
        .gte("date", startDate)
        .lte("date", endDate);
      data = result.data;
      error = result.error;
    } else {
      const result = await supabase
        .from("actions")
        .select("date")
        .eq("user_id", user.id)
        .gte("date", startDate)
        .lte("date", endDate);
      data = result.data;
      error = result.error;
    }
    if (error) handleSupabaseError(error, "get heatmap data");

    // Group by date and count
    const grouped = (data || []).reduce(
      (acc: Record<string, number>, action) => {
        const date =
          typeof action.date === "string"
            ? action.date.split("T")[0]
            : action.date;
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {}
    );

    return Object.entries(grouped).map(([date, count]) => ({ date, count }));
  },

  async getStreakData(
    pillarId?: string
  ): Promise<{ current: number; best: number }> {
    const user = await getCurrentUser();

    let data: any;
    let error: any;

    if (pillarId) {
      // Join with habits to filter by pillar
      const result = await supabase
        .from("actions")
        .select(
          `
          date,
          habits!inner(pillar_id)
        `
        )
        .eq("user_id", user.id)
        .eq("habits.pillar_id", pillarId)
        .order("date", { ascending: false });

      data = result.data;
      error = result.error;
    } else {
      // Get all actions without pillar filter
      const result = await supabase
        .from("actions")
        .select("date")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      data = result.data;
      error = result.error;
    }
    if (error) handleSupabaseError(error, "get streak data");

    const dates = (data || []).map((action: any) => {
      const date =
        typeof action.date === "string"
          ? action.date.split("T")[0]
          : action.date;
      return new Date(date);
    });

    // Calculate current and best streak
    const uniqueTimestamps = [...new Set(dates.map((d: Date) => d.getTime()))];
    const uniqueDates = uniqueTimestamps
      .sort((a, b) => (b as number) - (a as number))
      .map((time) => new Date(time as number));

    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate current streak
    for (let i = 0; i < uniqueDates.length; i++) {
      const date = uniqueDates[i];
      date.setHours(0, 0, 0, 0);

      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);

      if (date.getTime() === expectedDate.getTime()) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate best streak
    for (let i = 0; i < uniqueDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const currentDate = uniqueDates[i];
        const previousDate = uniqueDates[i - 1];
        const diffTime = previousDate.getTime() - currentDate.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        if (diffDays === 1) {
          tempStreak++;
        } else {
          bestStreak = Math.max(bestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    bestStreak = Math.max(bestStreak, tempStreak);

    return { current: currentStreak, best: bestStreak };
  },
};
