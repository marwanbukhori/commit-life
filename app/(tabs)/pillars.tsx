import { CreatePillarModal } from "@/components/CreatePillarModal";
import { PillarCard } from "@/components/PillarCard";
import { useAppStore } from "@/stores/app-store";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function PillarsScreen(): React.JSX.Element {
  const { pillars, loading } = useAppStore();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreatePillar = (): void => {
    setShowCreateModal(true);
  };

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: 50 }}>
      {/* Header */}
      <View className="bg-white px-6 pt-3 pb-6 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-gray-900">My Pillars</Text>
            <Text className="text-gray-600 mt-1">
              Organize your life into meaningful areas
            </Text>
          </View>
          <TouchableOpacity
            className="bg-primary-500 rounded-full w-12 h-12 items-center justify-center"
            onPress={handleCreatePillar}
          >
            <Text className="text-white text-2xl font-light">+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-4">
        {pillars.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <View className="bg-white rounded-2xl p-8 border border-gray-200 items-center max-w-sm">
              <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
                <Text className="text-2xl">🏛️</Text>
              </View>
              <Text className="text-xl font-semibold text-gray-900 mb-2 text-center">
                Create Your First Pillar
              </Text>
              <Text className="text-gray-600 text-center mb-6">
                Pillars help you organize habits into meaningful life areas like
                Health, Career, or Spirituality.
              </Text>
              <TouchableOpacity
                className="bg-primary-500 rounded-lg px-6 py-3"
                onPress={handleCreatePillar}
              >
                <Text className="text-white font-semibold">Get Started</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="space-y-4 pb-6">
            {pillars.map((pillar) => (
              <PillarCard key={pillar.id} pillar={pillar} />
            ))}
          </View>
        )}
      </ScrollView>

      <CreatePillarModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </View>
  );
}
