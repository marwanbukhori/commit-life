import { useAppStore } from "@/stores/app-store";
import React from "react";
import { Text, View } from "react-native";

export function TodayProgress(): React.JSX.Element {
  const { pillars, todayActions } = useAppStore();

  const totalHabits = pillars.reduce(
    (sum, pillar) => sum + pillar.habits.length,
    0
  );
  const completedToday = todayActions.length;
  const progressPercentage =
    totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;

  return (
    <View className="bg-white rounded-xl p-6 border border-gray-200">
      <Text className="text-lg font-semibold text-gray-900 mb-4">
        Today&apos;s Progress
      </Text>

      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text className="text-3xl font-bold text-gray-900">
            {completedToday}
          </Text>
          <Text className="text-sm text-gray-600">Commits today</Text>
        </View>
        <View className="items-end">
          <Text className="text-lg font-semibold text-primary-500">
            {Math.round(progressPercentage)}%
          </Text>
          <Text className="text-sm text-gray-600">of daily goals</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View className="bg-gray-200 rounded-full h-2 mb-3">
        <View
          className="bg-primary-500 rounded-full h-2"
          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
        />
      </View>

      <Text className="text-sm text-gray-600 text-center">
        {totalHabits === 0
          ? "Create some habits to start tracking progress"
          : `${completedToday} of ${totalHabits} habits completed`}
      </Text>
    </View>
  );
}
