import { actionsApi } from "@/lib/api";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

interface CommitHeatmapProps {
  pillarId?: string | null;
  period: "month" | "year";
}

interface HeatmapDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4; // GitHub-style intensity levels
}

export function CommitHeatmap({
  pillarId,
  period,
}: CommitHeatmapProps): React.JSX.Element {
  const [heatmapData, setHeatmapData] = useState<HeatmapDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateDateRange = () => {
    const days: string[] = [];
    const now = new Date();
    const daysToShow = period === "month" ? 30 : 365;

    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split("T")[0]);
    }

    return days;
  };

  const loadHeatmapData = async () => {
    try {
      setLoading(true);
      setError(null);

      const now = new Date();
      const daysToShow = period === "month" ? 30 : 365;
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - (daysToShow - 1));

      const startDateStr = startDate.toISOString().split("T")[0];
      const endDateStr = now.toISOString().split("T")[0];

      // Get data from API
      const apiData = await actionsApi.getHeatmapData(
        startDateStr,
        endDateStr,
        pillarId || undefined
      );

      // Create a map for quick lookup
      const dataMap = new Map(apiData.map((item) => [item.date, item.count]));

      // Generate all dates and fill with data
      const allDates = generateDateRange();
      const processedData: HeatmapDay[] = allDates.map((date) => {
        const count = dataMap.get(date) || 0;
        let level: 0 | 1 | 2 | 3 | 4 = 0;

        if (count === 0) level = 0;
        else if (count <= 2) level = 1;
        else if (count <= 4) level = 2;
        else if (count <= 7) level = 3;
        else level = 4;

        return {
          date,
          count,
          level,
        };
      });

      setHeatmapData(processedData);
    } catch (err) {
      console.error("Error loading heatmap data:", err);
      setError("Failed to load heatmap data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHeatmapData();
  }, [pillarId, period]);

  const getCellColor = (level: number): string => {
    const colors = [
      "bg-gray-100", // Level 0 - no activity
      "bg-green-200", // Level 1 - low activity
      "bg-green-300", // Level 2 - medium activity
      "bg-green-400", // Level 3 - high activity
      "bg-green-500", // Level 4 - very high activity
    ];
    return colors[level] || colors[0];
  };

  const groupDataByWeeks = (data: HeatmapDay[]) => {
    const weeks: HeatmapDay[][] = [];
    let currentWeek: HeatmapDay[] = [];

    data.forEach((day, index) => {
      const dayOfWeek = new Date(day.date).getDay();

      // Start a new week on Sunday
      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      currentWeek.push(day);

      // If it's the last day, push the current week
      if (index === data.length - 1) {
        weeks.push(currentWeek);
      }
    });

    return weeks;
  };

  if (loading) {
    return (
      <View className="bg-white rounded-xl p-6 border border-gray-200">
        <View className="items-center justify-center py-8">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="text-gray-600 mt-2">Loading heatmap data...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="bg-white rounded-xl p-6 border border-gray-200">
        <View className="items-center justify-center py-8">
          <Text className="text-red-500 text-center">{error}</Text>
          <Text className="text-gray-500 text-sm mt-1">
            Pull to refresh to try again
          </Text>
        </View>
      </View>
    );
  }

  const weeks = groupDataByWeeks(heatmapData);
  const totalCommits = heatmapData.reduce((sum, day) => sum + day.count, 0);
  const streakDays = heatmapData.filter((day) => day.count > 0).length;

  return (
    <View className="bg-white rounded-xl p-6 border border-gray-200">
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 mb-2">
          {totalCommits} commits in the last{" "}
          {period === "month" ? "month" : "year"}
        </Text>
        <Text className="text-sm text-gray-600">
          {streakDays} days with activity • Keep up the momentum!
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row space-x-1">
          {weeks.map((week, weekIndex) => (
            <View key={weekIndex} className="space-y-1">
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const day = week.find((_, i) => {
                  const date = new Date(week[0]?.date || "");
                  date.setDate(date.getDate() + i);
                  return date.getDay() === dayIndex;
                });

                return (
                  <View
                    key={dayIndex}
                    className={`w-3 h-3 rounded-sm ${
                      day ? getCellColor(day.level) : "bg-gray-50"
                    }`}
                    style={{ opacity: day ? 1 : 0.3 }}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Legend */}
      <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <Text className="text-xs text-gray-500">Less</Text>
        <View className="flex-row space-x-1">
          {[0, 1, 2, 3, 4].map((level) => (
            <View
              key={level}
              className={`w-3 h-3 rounded-sm ${getCellColor(level)}`}
            />
          ))}
        </View>
        <Text className="text-xs text-gray-500">More</Text>
      </View>
    </View>
  );
}
