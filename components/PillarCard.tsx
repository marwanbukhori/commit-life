import { PillarWithHabits } from "@/lib/types";
import { useAppStore } from "@/stores/app-store";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { CreateHabitModal } from "./CreateHabitModal";

interface PillarCardProps {
  pillar: PillarWithHabits;
}

export function PillarCard({ pillar }: PillarCardProps): React.JSX.Element {
  const [showCreateHabitModal, setShowCreateHabitModal] = useState(false);
  const { todayActions } = useAppStore();

  const habitCount = pillar.habits.length;

  // Calculate real completion based on today's actions
  const todayCompleted = pillar.habits.filter((habit) =>
    todayActions.some((action) => action.habit_id === habit.id)
  ).length;

  return (
    <TouchableOpacity className="bg-white rounded-xl p-6 border border-gray-200">
      <View className="flex-row items-start justify-between mb-4">
        <View className="flex-row items-center flex-1">
          <View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center mr-4">
            <Text className="text-xl">{pillar.icon}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900">
              {pillar.name}
            </Text>
            <Text className="text-sm text-gray-600">
              {habitCount} {habitCount === 1 ? "habit" : "habits"}
            </Text>
          </View>
        </View>
        <TouchableOpacity className="w-8 h-8 items-center justify-center">
          <Text className="text-gray-400 text-lg">⋯</Text>
        </TouchableOpacity>
      </View>

      {/* Progress */}
      <View className="mb-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-sm text-gray-600">Today&apos;s Progress</Text>
          <Text className="text-sm font-medium text-gray-900">
            {todayCompleted}/{habitCount}
          </Text>
        </View>
        <View className="bg-gray-200 rounded-full h-2">
          <View
            className="bg-primary-500 rounded-full h-2"
            style={{
              width:
                habitCount > 0
                  ? `${(todayCompleted / habitCount) * 100}%`
                  : "0%",
            }}
          />
        </View>
      </View>

      {/* Habits List */}
      {pillar.habits.length > 0 ? (
        <View className="space-y-2">
          {pillar.habits.slice(0, 3).map((habit) => {
            const isCompleted = todayActions.some(
              (action) => action.habit_id === habit.id
            );
            return (
              <View key={habit.id} className="flex-row items-center">
                <View
                  className={`w-4 h-4 rounded-full mr-3 ${
                    isCompleted ? "bg-success-500" : "bg-gray-200"
                  }`}
                >
                  {isCompleted && (
                    <Text className="text-white text-xs text-center leading-4">
                      ✓
                    </Text>
                  )}
                </View>
                <Text className="text-sm text-gray-700 flex-1">
                  {habit.name}
                </Text>
              </View>
            );
          })}
          {pillar.habits.length > 3 && (
            <Text className="text-xs text-gray-500 ml-7">
              +{pillar.habits.length - 3} more habits
            </Text>
          )}
          <TouchableOpacity
            className="mt-3 py-2 px-3 bg-primary-50 rounded-lg"
            onPress={() => setShowCreateHabitModal(true)}
          >
            <Text className="text-primary-600 text-sm font-medium text-center">
              + Add Habit
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="items-center py-4">
          <Text className="text-gray-500 text-sm">No habits yet</Text>
          <TouchableOpacity
            className="mt-2"
            onPress={() => setShowCreateHabitModal(true)}
          >
            <Text className="text-primary-500 text-sm font-medium">
              Add your first habit
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <CreateHabitModal
        visible={showCreateHabitModal}
        onClose={() => setShowCreateHabitModal(false)}
        pillarId={pillar.id}
        pillarName={pillar.name}
      />
    </TouchableOpacity>
  );
}
