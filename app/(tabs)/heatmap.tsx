import { CommitHeatmap } from "@/components/CommitHeatmap";
import { useAppStore } from "@/stores/app-store";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function HeatmapScreen(): React.JSX.Element {
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<"month" | "year">(
    "year"
  );
  const [isReady, setIsReady] = useState(false);

  // Safety delay to ensure navigation context is ready
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Get pillars from store with fallback
  let pillars: any[] = [];
  try {
    const store = useAppStore();
    pillars = store?.pillars || [];
  } catch (error) {
    console.warn("Store not ready:", error);
  }

  if (!isReady) {
    return (
      <View style={{ flex: 1, backgroundColor: "#f9fafb", paddingTop: 50 }}>
        <View
          style={{
            backgroundColor: "white",
            paddingHorizontal: 24,
            paddingTop: 12,
            paddingBottom: 24,
            borderBottomWidth: 1,
            borderBottomColor: "#e5e7eb",
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#111827" }}>
            Progress Heatmap
          </Text>
          <Text style={{ color: "#6b7280", marginTop: 4 }}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb", paddingTop: 50 }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "white",
          paddingHorizontal: 24,
          paddingTop: 12,
          paddingBottom: 24,
          borderBottomWidth: 1,
          borderBottomColor: "#e5e7eb",
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "#111827" }}>
          Progress Heatmap
        </Text>
        <Text style={{ color: "#6b7280", marginTop: 4 }}>
          Visualize your commit journey
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* Filter Controls */}
        <View
          style={{
            backgroundColor: "white",
            marginHorizontal: 24,
            marginTop: 16,
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: "#e5e7eb",
          }}
        >
          {/* Period Toggle */}
          <Text
            style={{
              fontSize: 14,
              fontWeight: "500",
              color: "#374151",
              marginBottom: 12,
            }}
          >
            Time Period
          </Text>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#f3f4f6",
              borderRadius: 8,
              padding: 4,
              marginBottom: 16,
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                borderRadius: 6,
                paddingVertical: 8,
                backgroundColor:
                  selectedPeriod === "month" ? "white" : "transparent",
                shadowOpacity: selectedPeriod === "month" ? 0.1 : 0,
                shadowRadius: 2,
                shadowOffset: { width: 0, height: 1 },
              }}
              onPress={() => setSelectedPeriod("month")}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "500",
                  color: selectedPeriod === "month" ? "#111827" : "#6b7280",
                }}
              >
                This Month
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                borderRadius: 6,
                paddingVertical: 8,
                backgroundColor:
                  selectedPeriod === "year" ? "white" : "transparent",
                shadowOpacity: selectedPeriod === "year" ? 0.1 : 0,
                shadowRadius: 2,
                shadowOffset: { width: 0, height: 1 },
              }}
              onPress={() => setSelectedPeriod("year")}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "500",
                  color: selectedPeriod === "year" ? "#111827" : "#6b7280",
                }}
              >
                This Year
              </Text>
            </TouchableOpacity>
          </View>

          {/* Pillar Filter */}
          <Text
            style={{
              fontSize: 14,
              fontWeight: "500",
              color: "#374151",
              marginBottom: 12,
            }}
          >
            Filter by Pillar
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginHorizontal: -4 }}
          >
            <View style={{ flexDirection: "row", paddingHorizontal: 4 }}>
              <TouchableOpacity
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  borderWidth: 1,
                  backgroundColor:
                    selectedPillar === null ? "#3b82f6" : "white",
                  borderColor: selectedPillar === null ? "#3b82f6" : "#d1d5db",
                  marginRight: 8,
                }}
                onPress={() => setSelectedPillar(null)}
              >
                <Text
                  style={{
                    fontWeight: "500",
                    color: selectedPillar === null ? "white" : "#374151",
                  }}
                >
                  All Pillars
                </Text>
              </TouchableOpacity>
              {pillars.map((pillar) => (
                <TouchableOpacity
                  key={pillar.id}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    borderWidth: 1,
                    backgroundColor:
                      selectedPillar === pillar.id ? "#3b82f6" : "white",
                    borderColor:
                      selectedPillar === pillar.id ? "#3b82f6" : "#d1d5db",
                    marginRight: 8,
                  }}
                  onPress={() => setSelectedPillar(pillar.id)}
                >
                  <Text
                    style={{
                      fontWeight: "500",
                      color: selectedPillar === pillar.id ? "white" : "#374151",
                    }}
                  >
                    {pillar.icon} {pillar.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Heatmap */}
        <View style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
          <CommitHeatmap
            key={`${selectedPillar}-${selectedPeriod}`}
            pillarId={selectedPillar}
            period={selectedPeriod}
          />
        </View>

        {/* Stats Summary */}
        <View style={{ marginHorizontal: 24, marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#111827",
              marginBottom: 16,
            }}
          >
            Summary Stats
          </Text>
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: "#e5e7eb",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 24, fontWeight: "bold", color: "#111827" }}
                >
                  127
                </Text>
                <Text style={{ fontSize: 14, color: "#6b7280" }}>
                  Total Commits
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 24, fontWeight: "bold", color: "#10b981" }}
                >
                  15
                </Text>
                <Text style={{ fontSize: 14, color: "#6b7280" }}>
                  Current Streak
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 24, fontWeight: "bold", color: "#3b82f6" }}
                >
                  42
                </Text>
                <Text style={{ fontSize: 14, color: "#6b7280" }}>
                  Best Streak
                </Text>
              </View>
            </View>
            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: "#f3f4f6",
                paddingTop: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#6b7280",
                  textAlign: "center",
                }}
              >
                Keep up the great work! You&apos;re building strong habits. 💪
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
