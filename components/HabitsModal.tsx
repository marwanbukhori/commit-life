import { useAppStore } from "@/stores/app-store";
import { useAuthStore } from "@/stores/auth-store";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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
    setIsCommitting(true);
    try {
      await onCommit();
      setTimeout(() => setIsCommitting(false), 500);
    } catch {
      setIsCommitting(false);
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
        disabled={isCommitting}
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

interface HabitsModalProps {
  visible: boolean;
  onClose: () => void;
}

export function HabitsModal({
  visible,
  onClose,
}: HabitsModalProps): React.JSX.Element {
  const { pillars, todayActions, addAction, removeAction } = useAppStore();
  const { user } = useAuthStore();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Get all habits from all pillars
  const allHabits = pillars.flatMap((pillar) =>
    pillar.habits.map((habit) => ({
      ...habit,
      pillarName: pillar.name,
      pillarIcon: pillar.icon,
      pillerId: pillar.id,
    }))
  );

  // Check which habits are completed today
  const getHabitCompletionStatus = (habitId: string): boolean => {
    return todayActions.some((action) => action.habit_id === habitId);
  };

  // Filter habits based on current filter and search
  const filteredHabits = allHabits.filter((habit) => {
    const matchesFilter =
      selectedFilter === "all" ||
      selectedFilter === habit.pillerId ||
      (selectedFilter === "completed" && getHabitCompletionStatus(habit.id)) ||
      (selectedFilter === "pending" && !getHabitCompletionStatus(habit.id));

    const matchesSearch =
      searchQuery === "" ||
      habit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      habit.pillarName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleToggleHabit = async (habitId: string): Promise<void> => {
    const today = new Date().toISOString().split("T")[0];
    const isCompleted = getHabitCompletionStatus(habitId);

    try {
      if (isCompleted) {
        // Remove the action (untick)
        await removeAction(habitId, today);
      } else {
        // Add the action (tick)
        await addAction({
          habit_id: habitId,
          date: today,
          client_action_id: `action_${Date.now()}_${Math.random()}`,
        });
      }
    } catch (error) {
      console.error("Error toggling habit:", error);
      // Could show an error message to user here
    }
  };

  const completedCount = allHabits.filter((habit) =>
    getHabitCompletionStatus(habit.id)
  ).length;

  const filterOptions = [
    { id: "all", label: "All Habits", icon: "📋" },
    { id: "pending", label: "Pending", icon: "⏳" },
    { id: "completed", label: "Completed", icon: "✅" },
    ...pillars.map((pillar) => ({
      id: pillar.id,
      label: pillar.name,
      icon: pillar.icon,
    })),
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white px-6 pt-12 pb-4 border-b border-gray-200">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-bold text-gray-900">All Habits</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-primary-500 font-semibold text-lg">
                Done
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-gray-600">
              {completedCount}/{allHabits.length} completed today
            </Text>
            <View className="bg-primary-100 rounded-full px-3 py-1">
              <Text className="text-primary-700 text-sm font-medium">
                {filteredHabits.length} shown
              </Text>
            </View>
          </View>

          {/* Search Bar */}
          <TextInput
            className="bg-gray-100 rounded-lg px-4 py-3 text-base"
            placeholder="Search habits..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Tabs */}
        <View
          style={{
            backgroundColor: "white",
            borderBottomWidth: 1,
            borderBottomColor: "#e5e7eb",
            paddingVertical: 8,
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
            }}
          >
            <View style={{ flexDirection: "row", gap: 8 }}>
              {filterOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 12,
                    borderWidth: 1,
                    backgroundColor:
                      selectedFilter === option.id ? "#3b82f6" : "white",
                    borderColor:
                      selectedFilter === option.id ? "#3b82f6" : "#d1d5db",
                    height: 24,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => setSelectedFilter(option.id)}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "500",
                      color: selectedFilter === option.id ? "white" : "#374151",
                    }}
                  >
                    {option.icon} {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Habits List */}
        <ScrollView className="flex-1 px-6 py-4">
          {filteredHabits.length === 0 ? (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-6xl mb-4">🔍</Text>
              <Text className="text-xl font-semibold text-gray-900 mb-2">
                No habits found
              </Text>
              <Text className="text-gray-600 text-center">
                {searchQuery
                  ? "Try adjusting your search or filters"
                  : "Create some habits to get started!"}
              </Text>
            </View>
          ) : (
            <View className="pb-6">
              {filteredHabits.map((habit) => (
                <HabitItem
                  key={habit.id}
                  habit={habit}
                  pillarName={habit.pillarName}
                  pillarIcon={habit.pillarIcon}
                  isCompleted={getHabitCompletionStatus(habit.id)}
                  onCommit={() => handleToggleHabit(habit.id)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}
