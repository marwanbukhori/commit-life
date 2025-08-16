import { QuickActionCard } from "@/components/QuickActionCard";
import { StreakCard } from "@/components/StreakCard";
import { TodayProgress } from "@/components/TodayProgress";
import { TodaysHabits } from "@/components/TodaysHabits";
import { useAppStore } from "@/stores/app-store";
import { useAuthStore } from "@/stores/auth-store";
import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DashboardScreen(): React.JSX.Element {
  const { user } = useAuthStore();
  const { pillars, todayActions, loading, loadSampleData } = useAppStore();
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  // Load sample data on first render for development
  useEffect(() => {
    if (pillars.length === 0) {
      loadSampleData();
    }
  }, [pillars.length, loadSampleData]);

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    // TODO: Implement data refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="bg-white px-6 pt-3 pb-6">
          <Text className="text-2xl font-bold text-gray-900">
            {getGreeting()}, {user?.user_metadata?.name || "there"}!
          </Text>
          <Text className="text-gray-600 mt-1">{todayDate}</Text>
        </View>

        {/* Today's Progress */}
        <View className="px-6 py-4">
          <TodayProgress />
        </View>

        {/* Today's Habits - Main Feature */}
        <View className="px-6 py-2">
          <TodaysHabits />
        </View>

        {/* Quick Actions */}
        <View className="px-6 py-2">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </Text>
          <View className="space-y-3">
            {pillars.length === 0 ? (
              <QuickActionCard
                title="Create Your First Pillar"
                subtitle="Start organizing your habits"
                icon="plus"
                onPress={() => {
                  /* Navigate to create pillar */
                }}
              />
            ) : (
              pillars.slice(0, 3).map((pillar) => (
                <QuickActionCard
                  key={pillar.id}
                  title={`Log ${pillar.name} Action`}
                  subtitle="Make a commit today"
                  icon={pillar.icon}
                  onPress={() => {
                    /* Navigate to log action */
                  }}
                />
              ))
            )}
          </View>
        </View>

        {/* Streak Cards */}
        <View className="px-6 py-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Your Streaks
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="space-x-4"
          >
            {pillars.map((pillar) => (
              <StreakCard
                key={pillar.id}
                pillar={pillar}
                streak={Math.floor(Math.random() * 30)} // TODO: Calculate real streak
              />
            ))}
            {pillars.length === 0 && (
              <View className="bg-white rounded-xl p-6 w-48 border border-gray-200">
                <Text className="text-gray-500 text-center">
                  Create pillars to track your streaks
                </Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Recent Activity */}
        <View className="px-6 py-4 pb-24">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </Text>
          {todayActions.length > 0 ? (
            <View className="bg-white rounded-xl p-4 border border-gray-200">
              {todayActions.slice(0, 5).map((action, index) => (
                <View
                  key={action.id}
                  className={`flex-row items-center justify-between py-3 ${
                    index < todayActions.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <View>
                    <Text className="font-medium text-gray-900">
                      Action logged
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {new Date(action.created_at).toLocaleTimeString()}
                    </Text>
                  </View>
                  <View className="w-2 h-2 bg-success-500 rounded-full" />
                </View>
              ))}
            </View>
          ) : (
            <View className="bg-white rounded-xl p-6 border border-gray-200">
              <Text className="text-gray-500 text-center">
                No activities yet today. Start by logging your first action!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
