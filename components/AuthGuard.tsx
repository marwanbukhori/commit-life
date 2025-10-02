import { useAppStore } from "@/stores/app-store";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps): React.JSX.Element {
  const { isAuthenticated, loading: authLoading } = useAuthStore();
  const { refreshData, loading: appLoading } = useAppStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inTabsGroup = segments[0] === "(tabs)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, authLoading, segments, router]);

  // Load data when user is authenticated and on tabs route
  useEffect(() => {
    if (isAuthenticated && !authLoading && segments[0] === "(tabs)") {
      // Load data in background without blocking UI
      refreshData().catch((error) => {
        console.log("Failed to load data, continuing anyway:", error);
      });
    }
  }, [isAuthenticated, authLoading, segments, refreshData]);

  if (authLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text className="mt-4 text-gray-600">Initializing...</Text>
      </View>
    );
  }

  // Remove the blocking loading screen for app data
  // Let the dashboard show even if data is still loading

  return <>{children}</>;
}
