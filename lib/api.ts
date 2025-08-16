import { supabase } from "./supabase";
import { Action, Habit, Pillar, PillarWithHabits } from "./types";

// Pillar API functions
export const pillarsApi = {
  async getAll(): Promise<PillarWithHabits[]> {
    const { data, error } = await supabase
      .from("pillars")
      .select(
        `
        *,
        habits (*)
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(pillar: Omit<Pillar, "id" | "created_at">): Promise<Pillar> {
    const { data, error } = await supabase
      .from("pillars")
      .insert([pillar])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Pillar>): Promise<Pillar> {
    const { data, error } = await supabase
      .from("pillars")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("pillars").delete().eq("id", id);

    if (error) throw error;
  },
};

// Habit API functions
export const habitsApi = {
  async create(habit: Omit<Habit, "id" | "created_at">): Promise<Habit> {
    const { data, error } = await supabase
      .from("habits")
      .insert([habit])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Habit>): Promise<Habit> {
    const { data, error } = await supabase
      .from("habits")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("habits").delete().eq("id", id);

    if (error) throw error;
  },
};

// Action API functions
export const actionsApi = {
  async getTodayActions(): Promise<Action[]> {
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("actions")
      .select("*")
      .gte("date", today)
      .lt("date", `${today}T23:59:59.999Z`)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(action: Omit<Action, "id" | "created_at">): Promise<Action> {
    const { data, error } = await supabase
      .from("actions")
      .insert([action])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getHeatmapData(
    startDate: string,
    endDate: string,
    pillarId?: string
  ): Promise<{ date: string; count: number }[]> {
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
        .eq("habits.pillar_id", pillarId)
        .gte("date", startDate)
        .lte("date", endDate);
      data = result.data;
      error = result.error;
    } else {
      const result = await supabase
        .from("actions")
        .select("date")
        .gte("date", startDate)
        .lte("date", endDate);
      data = result.data;
      error = result.error;
    }
    if (error) throw error;

    // Group by date and count
    const grouped = (data || []).reduce(
      (acc: Record<string, number>, action) => {
        const date = action.date.split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {}
    );

    return Object.entries(grouped).map(([date, count]) => ({ date, count }));
  },
};
