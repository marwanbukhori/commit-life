import React from "react";
import { ScrollView, Text, View } from "react-native";

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
  const generateHeatmapData = () => {
    const days: HeatmapDay[] = [];
    const now = new Date();
    const daysToShow = period === "month" ? 30 : 365;

    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      // Generate random commit count (0-10)
      const count = Math.floor(Math.random() * 11);
      let level: 0 | 1 | 2 | 3 | 4 = 0;

      if (count === 0) level = 0;
      else if (count <= 2) level = 1;
      else if (count <= 4) level = 2;
      else if (count <= 7) level = 3;
      else level = 4;

      days.push({
        date: date.toISOString().split("T")[0],
        count,
        level,
      });
    }

    return days;
  };

  const heatmapData = generateHeatmapData();

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
