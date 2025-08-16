// Core data types for Commit Life app

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Pillar {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  created_at: string;
}

export interface Habit {
  id: string;
  pillar_id: string;
  name: string;
  frequency_type: "daily" | "weekly" | "monthly";
  target_per_period: number;
  metric_type: "none" | "number" | "duration";
  created_at: string;
}

export interface Action {
  id: string;
  habit_id: string;
  user_id: string;
  date: string;
  note?: string;
  value?: number;
  client_action_id?: string;
  created_at: string;
}

export interface HeatmapData {
  date: string;
  count: number;
}

export interface MonthlySummary {
  id: string;
  user_id: string;
  pillar_id?: string;
  month: string; // YYYY-MM format
  total_actions: number;
  streak_longest: number;
  completion_rate: number;
  highlights: {
    top_pillar?: string;
    weakest_pillar?: string;
    longest_streak?: number;
    badges?: string[];
  };
}

export interface PillarWithHabits extends Pillar {
  habits: Habit[];
}

export interface HabitWithActions extends Habit {
  actions: Action[];
  todayCompleted: boolean;
  currentStreak: number;
}
