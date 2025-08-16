import { PillarWithHabits } from "./types";

// Sample data for development/testing
export const samplePillars: PillarWithHabits[] = [
  {
    id: "pillar_1",
    user_id: "user_1",
    name: "Health & Fitness",
    icon: "💪",
    created_at: "2024-01-01T00:00:00.000Z",
    habits: [
      {
        id: "habit_1",
        pillar_id: "pillar_1",
        name: "Morning Workout",
        frequency_type: "daily",
        target_per_period: 1,
        metric_type: "none",
        created_at: "2024-01-01T00:00:00.000Z",
      },
      {
        id: "habit_2",
        pillar_id: "pillar_1",
        name: "Drink 8 Glasses of Water",
        frequency_type: "daily",
        target_per_period: 8,
        metric_type: "number",
        created_at: "2024-01-01T00:00:00.000Z",
      },
    ],
  },
  {
    id: "pillar_2",
    user_id: "user_1",
    name: "Spiritual Growth",
    icon: "🙏",
    created_at: "2024-01-01T00:00:00.000Z",
    habits: [
      {
        id: "habit_3",
        pillar_id: "pillar_2",
        name: "Morning Prayer",
        frequency_type: "daily",
        target_per_period: 1,
        metric_type: "none",
        created_at: "2024-01-01T00:00:00.000Z",
      },
      {
        id: "habit_4",
        pillar_id: "pillar_2",
        name: "Read Quran",
        frequency_type: "daily",
        target_per_period: 15,
        metric_type: "duration",
        created_at: "2024-01-01T00:00:00.000Z",
      },
    ],
  },
  {
    id: "pillar_3",
    user_id: "user_1",
    name: "Career Development",
    icon: "💼",
    created_at: "2024-01-01T00:00:00.000Z",
    habits: [
      {
        id: "habit_5",
        pillar_id: "pillar_3",
        name: "Code Practice",
        frequency_type: "daily",
        target_per_period: 60,
        metric_type: "duration",
        created_at: "2024-01-01T00:00:00.000Z",
      },
    ],
  },
];

// Load sample data into the store (for development)
export const loadSampleData = () => {
  // This would be used in development mode
  return samplePillars;
};
