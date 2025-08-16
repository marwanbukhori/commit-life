import { Text, TouchableOpacity, View } from "react-native";

interface QuickActionCardProps {
  title: string;
  subtitle: string;
  icon: string;
  onPress: () => void;
}

export function QuickActionCard({
  title,
  subtitle,
  icon,
  onPress,
}: QuickActionCardProps): React.JSX.Element {
  return (
    <TouchableOpacity
      className="bg-white rounded-xl p-4 border border-gray-200 flex-row items-center"
      onPress={onPress}
    >
      <View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center mr-4">
        <Text className="text-lg">{icon}</Text>
      </View>
      <View className="flex-1">
        <Text className="font-semibold text-gray-900">{title}</Text>
        <Text className="text-sm text-gray-600 mt-1">{subtitle}</Text>
      </View>
      <Text className="text-gray-400 text-lg">›</Text>
    </TouchableOpacity>
  );
}
