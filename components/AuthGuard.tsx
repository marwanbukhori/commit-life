import { useAuthStore } from "@/stores/auth-store";
import { useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps): React.JSX.Element {
  const { isAuthenticated, loading } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inTabsGroup = segments[0] === "(tabs)";

    // TODO: Enable authentication when Supabase is configured
    // Original authentication logic (commented out for development):
    // if (!isAuthenticated && !inAuthGroup) {
    //   router.replace("/(auth)/login");
    // } else if (isAuthenticated && inAuthGroup) {
    //   router.replace("/(tabs)");
    // }

    // Skip authentication for development - go directly to main app (only if not already in tabs)
    if (!inAuthGroup && !inTabsGroup) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, loading, segments, router]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return <>{children}</>;
}
