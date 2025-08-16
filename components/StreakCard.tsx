import { Pillar } from "@/lib/types";
import { Text, TouchableOpacity, View } from "react-native";

interface StreakCardProps {
  pillar: Pillar;
  streak: number;
}

export function StreakCard({
  pillar,
  streak,
}: StreakCardProps): React.JSX.Element {
  const getStreakColor = (streak: number): string => {
    if (streak >= 30) return "text-yellow-500";
    if (streak >= 14) return "text-green-500";
    if (streak >= 7) return "text-blue-500";
    return "text-gray-500";
  };

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 30) return "🔥";
    if (streak >= 14) return "⭐";
    if (streak >= 7) return "💪";
    return "🌱";
  };

  return (
    <TouchableOpacity className="bg-white rounded-xl p-4 border border-gray-200 w-36 mr-3">
      <View className="items-center">
        <Text className="text-2xl mb-2">{pillar.icon}</Text>
        <Text className="font-medium text-gray-900 text-center text-sm mb-2">
          {pillar.name}
        </Text>
        <View className="flex-row items-center">
          <Text className="text-xl">{getStreakEmoji(streak)}</Text>
          <Text className={`text-xl font-bold ml-1 ${getStreakColor(streak)}`}>
            {streak}
          </Text>
        </View>
        <Text className="text-xs text-gray-500 mt-1">
          {streak === 1 ? "day" : "days"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
