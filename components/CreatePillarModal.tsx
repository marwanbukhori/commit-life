import { useAppStore } from "@/stores/app-store";
import { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface CreatePillarModalProps {
  visible: boolean;
  onClose: () => void;
}

const PILLAR_ICONS = [
  "🏥",
  "💪",
  "📚",
  "💼",
  "🏠",
  "❤️",
  "🙏",
  "🎨",
  "🌱",
  "💰",
  "🎯",
  "🌟",
  "🔥",
  "⚡",
  "🚀",
  "🏆",
];

const SUGGESTED_PILLARS = [
  { name: "Health & Fitness", icon: "💪" },
  { name: "Career", icon: "💼" },
  { name: "Spiritual", icon: "🙏" },
  { name: "Learning", icon: "📚" },
  { name: "Family", icon: "❤️" },
  { name: "Finance", icon: "💰" },
];

export function CreatePillarModal({
  visible,
  onClose,
}: CreatePillarModalProps): React.JSX.Element {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("🏆");
  const [loading, setLoading] = useState(false);
  const addPillar = useAppStore((state) => state.addPillar);

  const handleCreatePillar = async (): Promise<void> => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a pillar name");
      return;
    }

    setLoading(true);
    try {
      await addPillar({
        name: name.trim(),
        icon: selectedIcon,
        description: "", // Add description field later if needed
        color: "#3b82f6", // Default color
      });

      // Reset form
      setName("");
      setSelectedIcon("🏆");
      onClose();

      Alert.alert("Success", "Pillar created successfully!");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create pillar");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedPillar = (
    suggested: (typeof SUGGESTED_PILLARS)[0]
  ): void => {
    setName(suggested.name);
    setSelectedIcon(suggested.icon);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between p-6 border-b border-gray-200">
          <TouchableOpacity onPress={onClose}>
            <Text className="text-primary-500 font-medium">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold">Create Pillar</Text>
          <TouchableOpacity
            onPress={handleCreatePillar}
            disabled={loading || !name.trim()}
          >
            <Text
              className={`font-medium ${
                loading || !name.trim() ? "text-gray-400" : "text-primary-500"
              }`}
            >
              {loading ? "Creating..." : "Create"}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-6">
          {/* Pillar Name */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Pillar Name
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base"
              placeholder="e.g., Health & Fitness"
              value={name}
              onChangeText={setName}
              autoFocus
            />
          </View>

          {/* Icon Selection */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-3">
              Choose an Icon
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {PILLAR_ICONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  className={`w-12 h-12 rounded-lg items-center justify-center ${
                    selectedIcon === icon ? "bg-primary-500" : "bg-gray-100"
                  }`}
                  onPress={() => setSelectedIcon(icon)}
                >
                  <Text className="text-xl">{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Suggested Pillars */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-3">
              Quick Start
            </Text>
            <Text className="text-xs text-gray-500 mb-3">
              Tap a suggestion to use it as a starting point
            </Text>
            <View className="space-y-2">
              {SUGGESTED_PILLARS.map((suggested) => (
                <TouchableOpacity
                  key={suggested.name}
                  className="flex-row items-center p-3 bg-gray-50 rounded-lg"
                  onPress={() => handleSuggestedPillar(suggested)}
                >
                  <Text className="text-lg mr-3">{suggested.icon}</Text>
                  <Text className="text-gray-900 font-medium">
                    {suggested.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Preview */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-3">
              Preview
            </Text>
            <View className="bg-gray-50 rounded-lg p-4 flex-row items-center">
              <View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center mr-4">
                <Text className="text-xl">{selectedIcon}</Text>
              </View>
              <View>
                <Text className="font-semibold text-gray-900">
                  {name || "Your Pillar Name"}
                </Text>
                <Text className="text-sm text-gray-600">0 habits</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
