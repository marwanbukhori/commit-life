import { CommitHeatmap } from "@/components/CommitHeatmap";
import { useAppStore } from "@/stores/app-store";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HeatmapScreen(): React.JSX.Element {
  const { pillars } = useAppStore();
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<"month" | "year">(
    "year"
  );
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="bg-white px-6 pt-3 pb-6 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">
          Progress Heatmap
        </Text>
        <Text className="text-gray-600 mt-1">
          Visualize your commit journey
        </Text>
      </View>

      <ScrollView className="flex-1">
        {/* Filter Controls */}
        <View className="bg-white mx-6 mt-4 rounded-xl p-4 border border-gray-200">
          {/* Period Toggle */}
          <Text className="text-sm font-medium text-gray-700 mb-3">
            Time Period
          </Text>
          <View className="flex-row bg-gray-100 rounded-lg p-1 mb-4">
            <TouchableOpacity
              className={`flex-1 rounded-md py-2 ${
                selectedPeriod === "month" ? "bg-white shadow-sm" : ""
              }`}
              onPress={() => setSelectedPeriod("month")}
            >
              <Text
                className={`text-center font-medium ${
                  selectedPeriod === "month" ? "text-gray-900" : "text-gray-600"
                }`}
              >
                This Month
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 rounded-md py-2 ${
                selectedPeriod === "year" ? "bg-white shadow-sm" : ""
              }`}
              onPress={() => setSelectedPeriod("year")}
            >
              <Text
                className={`text-center font-medium ${
                  selectedPeriod === "year" ? "text-gray-900" : "text-gray-600"
                }`}
              >
                This Year
              </Text>
            </TouchableOpacity>
          </View>

          {/* Pillar Filter */}
          <Text className="text-sm font-medium text-gray-700 mb-3">
            Filter by Pillar
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="space-x-2"
          >
            <TouchableOpacity
              className={`px-4 py-2 rounded-full border ${
                selectedPillar === null
                  ? "bg-primary-500 border-primary-500"
                  : "bg-white border-gray-300"
              }`}
              onPress={() => setSelectedPillar(null)}
            >
              <Text
                className={`font-medium ${
                  selectedPillar === null ? "text-white" : "text-gray-700"
                }`}
              >
                All Pillars
              </Text>
            </TouchableOpacity>
            {pillars.map((pillar) => (
              <TouchableOpacity
                key={pillar.id}
                className={`px-4 py-2 rounded-full border ${
                  selectedPillar === pillar.id
                    ? "bg-primary-500 border-primary-500"
                    : "bg-white border-gray-300"
                }`}
                onPress={() => setSelectedPillar(pillar.id)}
              >
                <Text
                  className={`font-medium ${
                    selectedPillar === pillar.id
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  {pillar.icon} {pillar.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Heatmap */}
        <View className="px-6 py-4">
          <CommitHeatmap pillarId={selectedPillar} period={selectedPeriod} />
        </View>

        {/* Stats Summary */}
        <View className="mx-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Summary Stats
          </Text>
          <View className="bg-white rounded-xl p-4 border border-gray-200">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-1">
                <Text className="text-2xl font-bold text-gray-900">127</Text>
                <Text className="text-sm text-gray-600">Total Commits</Text>
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-success-500">15</Text>
                <Text className="text-sm text-gray-600">Current Streak</Text>
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-primary-500">42</Text>
                <Text className="text-sm text-gray-600">Best Streak</Text>
              </View>
            </View>
            <View className="border-t border-gray-100 pt-4">
              <Text className="text-sm text-gray-600 text-center">
                Keep up the great work! You&apos;re building strong habits. 💪
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
