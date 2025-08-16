import { Action } from "@/lib/types";
import { useAppStore } from "@/stores/app-store";
import { useAuthStore } from "@/stores/auth-store";
import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { HabitsModal } from "./HabitsModal";

interface HabitItemProps {
  habit: any;
  pillarName: string;
  pillarIcon: string;
  isCompleted: boolean;
  onCommit: () => void;
}

function HabitItem({
  habit,
  pillarName,
  pillarIcon,
  isCompleted,
  onCommit,
}: HabitItemProps): React.JSX.Element {
  const [isCommitting, setIsCommitting] = useState(false);

  const handleCommit = async (): Promise<void> => {
    if (isCompleted) return;

    setIsCommitting(true);
    try {
      await onCommit();
      // Add a small delay for visual feedback
      setTimeout(() => setIsCommitting(false), 500);
    } catch (error) {
      setIsCommitting(false);
      Alert.alert("Error", "Failed to commit habit");
    }
  };

  return (
    <View className="flex-row items-center justify-between p-4 bg-white rounded-xl border border-gray-200 mb-3">
      <View className="flex-row items-center flex-1">
        <View className="w-10 h-10 bg-primary-100 rounded-full items-center justify-center mr-3">
          <Text className="text-lg">{pillarIcon}</Text>
        </View>
        <View className="flex-1">
          <Text className="font-semibold text-gray-900">{habit.name}</Text>
          <Text className="text-sm text-gray-500">{pillarName}</Text>
          {habit.metric_type !== "none" && (
            <Text className="text-xs text-gray-400">
              Target: {habit.target_per_period}{" "}
              {habit.metric_type === "duration" ? "min" : ""}
            </Text>
          )}
        </View>
      </View>

      <TouchableOpacity
        className={`w-12 h-12 rounded-full items-center justify-center ${
          isCompleted
            ? "bg-success-500"
            : isCommitting
            ? "bg-primary-300"
            : "bg-gray-200"
        }`}
        onPress={handleCommit}
        disabled={isCompleted || isCommitting}
      >
        {isCompleted ? (
          <Text className="text-white text-lg font-bold">✓</Text>
        ) : isCommitting ? (
          <Text className="text-white text-sm">⟳</Text>
        ) : (
          <Text className="text-gray-500 text-lg">+</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

export function TodaysHabits(): React.JSX.Element {
  const { pillars, todayActions, addAction } = useAppStore();
  const { user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);

  // Get all habits from all pillars
  const allHabits = pillars.flatMap((pillar) =>
    pillar.habits.map((habit) => ({
      ...habit,
      pillarName: pillar.name,
      pillarIcon: pillar.icon,
    }))
  );

  // Check which habits are completed today
  const getHabitCompletionStatus = (habitId: string): boolean => {
    return todayActions.some((action) => action.habit_id === habitId);
  };

  const handleCommitHabit = async (habitId: string): Promise<void> => {
    // For development without auth, use a dummy user ID
    const userId = user?.id || "dev_user_id";

    const newAction: Omit<Action, "id" | "created_at"> = {
      habit_id: habitId,
      user_id: userId,
      date: new Date().toISOString(),
      client_action_id: `action_${Date.now()}_${Math.random()}`,
    };

    // Add to store (in real app, this would call API)
    addAction({
      ...newAction,
      id: `action_${Date.now()}`,
      created_at: new Date().toISOString(),
    });
  };

  const completedCount = allHabits.filter((habit) =>
    getHabitCompletionStatus(habit.id)
  ).length;

  // Get unfinished habits for dashboard display (max 3)
  const unfinishedHabits = allHabits
    .filter((habit) => !getHabitCompletionStatus(habit.id))
    .slice(0, 3);

  const totalUnfinishedCount = allHabits.filter(
    (habit) => !getHabitCompletionStatus(habit.id)
  ).length;

  if (allHabits.length === 0) {
    return (
      <View className="bg-white rounded-xl p-6 border border-gray-200">
        <Text className="text-lg font-semibold text-gray-900 mb-2">
          Today&apos;s Habits
        </Text>
        <Text className="text-gray-500 text-center py-8">
          Create some habits in your pillars to start tracking your daily
          commits!
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-semibold text-gray-900">
          Today&apos;s Habits
        </Text>
        <View className="bg-white rounded-full px-3 py-1">
          <Text className="text-sm font-medium text-primary-600">
            {completedCount}/{allHabits.length}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View className="bg-gray-200 rounded-full h-2 mb-4">
        <View
          className="bg-primary-500 rounded-full h-2 transition-all duration-300"
          style={{
            width:
              allHabits.length > 0
                ? `${(completedCount / allHabits.length) * 100}%`
                : "0%",
          }}
        />
      </View>

      {/* Habits List - Show only 3 unfinished habits */}
      <View>
        {unfinishedHabits.map((habit) => (
          <HabitItem
            key={habit.id}
            habit={habit}
            pillarName={habit.pillarName}
            pillarIcon={habit.pillarIcon}
            isCompleted={getHabitCompletionStatus(habit.id)}
            onCommit={() => handleCommitHabit(habit.id)}
          />
        ))}

        {/* See More Button */}
        {(totalUnfinishedCount > 3 || completedCount > 0) && (
          <TouchableOpacity
            className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-4 items-center justify-center mt-2"
            onPress={() => setShowModal(true)}
          >
            <View className="items-center">
              <Text className="text-primary-600 font-semibold text-base">
                See All Habits
              </Text>
              <Text className="text-gray-500 text-sm mt-1">
                {totalUnfinishedCount > 3 &&
                  `+${totalUnfinishedCount - 3} more pending`}
                {totalUnfinishedCount > 3 && completedCount > 0 && " • "}
                {completedCount > 0 && `${completedCount} completed`}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {completedCount === allHabits.length && allHabits.length > 0 && (
        <View className="bg-success-100 rounded-lg p-3 mt-2">
          <Text className="text-success-700 text-center font-medium">
            🎉 All habits completed today! Great job!
          </Text>
        </View>
      )}

      {/* Habits Modal */}
      <HabitsModal visible={showModal} onClose={() => setShowModal(false)} />
    </View>
  );
}
