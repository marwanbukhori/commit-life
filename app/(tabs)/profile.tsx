import { useAuthStore } from "@/stores/auth-store";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen(): React.JSX.Element {
  const { user, signOut } = useAuthStore();

  const handleSignOut = (): void => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
          } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to sign out");
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: 50 }}>
      {/* Header */}
      <View className="bg-white px-6 pt-3 pb-6 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Profile</Text>
        <Text className="text-gray-600 mt-1">
          Manage your account and preferences
        </Text>
      </View>

      <ScrollView className="flex-1">
        {/* User Info */}
        <View className="bg-white mx-6 mt-6 rounded-xl p-6 border border-gray-200">
          <View className="items-center mb-6">
            <View className="w-20 h-20 bg-primary-500 rounded-full items-center justify-center mb-4">
              <Text className="text-white text-2xl font-bold">
                {user?.user_metadata?.name?.charAt(0)?.toUpperCase() ||
                  user?.email?.charAt(0)?.toUpperCase() ||
                  "U"}
              </Text>
            </View>
            <Text className="text-xl font-semibold text-gray-900">
              {user?.user_metadata?.name || "User"}
            </Text>
            <Text className="text-gray-600">{user?.email}</Text>
          </View>

          <View className="border-t border-gray-100 pt-4">
            <Text className="text-sm text-gray-600 text-center">
              Member since{" "}
              {new Date(user?.created_at || "").toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <View className="bg-white mx-6 mt-4 rounded-xl border border-gray-200 overflow-hidden">
          <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-100">
            <View className="flex-row items-center">
              <Text className="text-lg mr-3">📊</Text>
              <Text className="text-gray-900 font-medium">Export Data</Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-100">
            <View className="flex-row items-center">
              <Text className="text-lg mr-3">🔔</Text>
              <Text className="text-gray-900 font-medium">Notifications</Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-100">
            <View className="flex-row items-center">
              <Text className="text-lg mr-3">🎨</Text>
              <Text className="text-gray-900 font-medium">Themes</Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-100">
            <View className="flex-row items-center">
              <Text className="text-lg mr-3">❓</Text>
              <Text className="text-gray-900 font-medium">Help & Support</Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center">
              <Text className="text-lg mr-3">ℹ️</Text>
              <Text className="text-gray-900 font-medium">About</Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <View className="px-6 py-6">
          <TouchableOpacity
            className="bg-red-500 rounded-lg py-4"
            onPress={handleSignOut}
          >
            <Text className="text-white text-center font-semibold">
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View className="px-6 pb-8">
          <Text className="text-center text-gray-500 text-sm">
            Commit Life v1.0.0
          </Text>
          <Text className="text-center text-gray-400 text-xs mt-1">
            Made with ❤️ for better habits
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
