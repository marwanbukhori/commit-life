import { useAppStore } from "@/stores/app-store";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface CreateHabitModalProps {
  visible: boolean;
  onClose: () => void;
  pillarId: string;
  pillarName: string;
}

export function CreateHabitModal({
  visible,
  onClose,
  pillarId,
  pillarName,
}: CreateHabitModalProps): React.JSX.Element {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [targetFrequency, setTargetFrequency] = useState("1");
  const [loading, setLoading] = useState(false);
  const { addHabit } = useAppStore();

  const handleCreateHabit = async (): Promise<void> => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a habit name");
      return;
    }

    const frequency = parseInt(targetFrequency);
    if (isNaN(frequency) || frequency < 1) {
      Alert.alert("Error", "Please enter a valid target frequency");
      return;
    }

    setLoading(true);
    try {
      await addHabit({
        pillar_id: pillarId,
        name: name.trim(),
        description: description.trim() || undefined,
        target_frequency: frequency,
        is_active: true,
      });

      // Reset form
      setName("");
      setDescription("");
      setTargetFrequency("1");
      onClose();

      Alert.alert("Success! 🎉", "Habit created successfully!");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create habit");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (): void => {
    setName("");
    setDescription("");
    setTargetFrequency("1");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-white"
      >
        {/* Header */}
        <View className="bg-white px-6 pt-12 pb-6 border-b border-gray-200">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={handleClose}>
              <Text className="text-primary-500 text-lg">Cancel</Text>
            </TouchableOpacity>
            <View className="items-center">
              <Text className="text-lg font-semibold text-gray-900">
                Add Habit
              </Text>
              <Text className="text-sm text-gray-600">{pillarName}</Text>
            </View>
            <TouchableOpacity
              onPress={handleCreateHabit}
              disabled={loading || !name.trim()}
            >
              <Text
                className={`text-lg font-semibold ${
                  loading || !name.trim() ? "text-gray-400" : "text-primary-500"
                }`}
              >
                {loading ? "Creating..." : "Create"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 px-6 py-6">
          {/* Habit Name */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Habit Name *
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base"
              placeholder="e.g., Drink 8 glasses of water"
              value={name}
              onChangeText={setName}
              autoFocus
            />
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base"
              placeholder="Add details about this habit..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Target Frequency */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Target per Day
            </Text>
            <View className="flex-row items-center space-x-3">
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base text-center w-20"
                value={targetFrequency}
                onChangeText={setTargetFrequency}
                keyboardType="number-pad"
                maxLength={2}
              />
              <Text className="text-gray-600">
                time{parseInt(targetFrequency) !== 1 ? "s" : ""} per day
              </Text>
            </View>
            <Text className="text-xs text-gray-500 mt-1">
              How many times you want to do this habit daily
            </Text>
          </View>

          {/* Quick Frequency Buttons */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-3">
              Quick Select
            </Text>
            <View className="flex-row space-x-2">
              {["1", "2", "3", "5"].map((freq) => (
                <TouchableOpacity
                  key={freq}
                  className={`flex-1 py-3 rounded-lg border ${
                    targetFrequency === freq
                      ? "bg-primary-500 border-primary-500"
                      : "bg-white border-gray-300"
                  }`}
                  onPress={() => setTargetFrequency(freq)}
                >
                  <Text
                    className={`text-center font-medium ${
                      targetFrequency === freq ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {freq}x
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Tips */}
          <View className="bg-blue-50 rounded-lg p-4">
            <Text className="text-sm font-medium text-blue-900 mb-2">
              💡 Tips for Great Habits
            </Text>
            <Text className="text-sm text-blue-800 leading-5">
              • Start small and be specific
              {"\n"}• Choose realistic frequencies
              {"\n"}• Focus on consistency over perfection
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
