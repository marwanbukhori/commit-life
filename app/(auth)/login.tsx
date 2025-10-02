import { useAuthStore } from "@/stores/auth-store";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen(): React.JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);
  const { signIn, resendVerification } = useAuthStore();

  const handleLogin = async (): Promise<void> => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      Alert.alert("Success! 🎉", "Welcome back! You're now logged in.");
    } catch (error: any) {
      let errorMessage = error.message || "An error occurred";

      // Provide helpful message for common errors
      if (error.message?.includes("Invalid login credentials")) {
        setShowResendButton(true);
        errorMessage =
          "Account not verified. Check your email or resend verification.";
      } else if (error.message?.includes("Email not confirmed")) {
        setShowResendButton(true);
        errorMessage = "Please verify your email first or resend verification.";
      }

      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async (): Promise<void> => {
    if (!email) {
      Alert.alert("Error", "Please enter your email first");
      return;
    }

    try {
      await resendVerification(email);
      Alert.alert("Success", "Verification email sent! Check your inbox.");
      setShowResendButton(false);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to resend verification");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="flex-1 justify-center px-6">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
            Welcome Back
          </Text>
          <Text className="text-gray-600 text-center">
            Continue your life commits journey
          </Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Email
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Password
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />
          </View>

          <TouchableOpacity
            className={`rounded-lg py-4 ${
              loading ? "bg-gray-400" : "bg-primary-500"
            }`}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text className="text-white text-center font-semibold text-base">
              {loading ? "Signing In..." : "Sign In"}
            </Text>
          </TouchableOpacity>

          {showResendButton && (
            <TouchableOpacity
              className="mt-4 rounded-lg py-3 border border-primary-500"
              onPress={handleResendVerification}
            >
              <Text className="text-primary-500 text-center font-semibold text-base">
                Resend Verification Email
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="mt-6 flex-row justify-center">
          <Text className="text-gray-600">Don&apos;t have an account? </Text>
          <Link href="/(auth)/signup" asChild>
            <TouchableOpacity>
              <Text className="text-primary-500 font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
