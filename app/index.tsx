import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  ListRenderItem,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Bell,
  Plus,
  Settings,
  TrendingUp,
  Users,
  Calendar,
  Wallet,
} from "lucide-react-native";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  isPast,
} from "date-fns";

import ActiveCycleCard from "../components/ActiveCycleCard";
import NextEventCard from "../components/NextEventCard";
import CycleDetailModal from "../components/CycleDetailModal";
import SettingsModal from "../components/SettingsModal";
import { useMockWallet } from "../hooks/useMockWallet";
import { useTheme } from "../contexts/ThemeContext";
import { CycleData, TimeRemaining } from "../types";

export default function HomeScreen(): JSX.Element {
  const [selectedCycle, setSelectedCycle] = useState<CycleData | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isDark } = useTheme();

  // Use the custom wallet hook
  const {
    walletAddress,
    isConnecting,
    connect: connectWallet,
    disconnect: disconnectWallet,
  } = useMockWallet();

  // Update time every minute for countdown timers
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Simulate loading data
  useEffect(() => {
    const loadData = async () => {
      // Simulate API call or data loading
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Enhanced mock data for active cycles with more detailed information
  const activeCycles: CycleData[] = [
    {
      id: "1",
      cycleName: "Office Friends Paluwagan",
      cycleNumber: 3,
      totalCycles: 6,
      status: "ongoing",
      memberCount: 6,
      progressPercentage: 60,
      paymentStatus: "paid",
      dueDate: "July 15",
      contributionAmount: "₱5,000",
      nextEventDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
      nextEventType: "payout",
      nextEventAmount: "₱30,000",
      totalPoolAmount: 180000,
      currentPoolAmount: 108000,
    },
    {
      id: "2",
      cycleName: "Family Circle Savings",
      cycleNumber: 2,
      totalCycles: 10,
      status: "ongoing",
      memberCount: 10,
      progressPercentage: 25,
      paymentStatus: "due",
      dueDate: "July 10",
      contributionAmount: "₱2,000",
      nextEventDate: new Date(Date.now() + 86400000 * 1), // 1 day from now
      nextEventType: "contribution",
      nextEventAmount: "₱2,000",
      totalPoolAmount: 200000,
      currentPoolAmount: 50000,
    },
    {
      id: "3",
      cycleName: "Neighborhood Group",
      cycleNumber: 4,
      totalCycles: 5,
      status: "ongoing",
      memberCount: 5,
      progressPercentage: 85,
      paymentStatus: "missed",
      dueDate: "July 5",
      contributionAmount: "₱1,500",
      nextEventDate: new Date(Date.now() - 86400000 * 2), // 2 days ago (overdue)
      nextEventType: "contribution",
      nextEventAmount: "₱1,500",
      totalPoolAmount: 75000,
      currentPoolAmount: 63750,
    },
  ];

  // Calculate next event details with better overdue handling
  const getNextEvent = useCallback((): CycleData | null => {
    const upcomingEvents = activeCycles
      .filter(
        (cycle) =>
          !isPast(cycle.nextEventDate) || cycle.paymentStatus === "missed",
      )
      .sort((a, b) => {
        if (a.paymentStatus === "missed" && b.paymentStatus !== "missed")
          return -1;
        if (b.paymentStatus === "missed" && a.paymentStatus !== "missed")
          return 1;
        return a.nextEventDate.getTime() - b.nextEventDate.getTime();
      });

    return upcomingEvents[0] || activeCycles[0] || null;
  }, [activeCycles, currentTime]);

  const nextEvent = getNextEvent();

  // Calculate time remaining for next event using date-fns
  const getTimeRemaining = useCallback(
    (eventDate: Date): TimeRemaining => {
      const now = currentTime;

      if (isPast(eventDate)) {
        return { days: 0, hours: 0, minutes: 0 };
      }

      const days = Math.max(0, differenceInDays(eventDate, now));
      const hours = Math.max(0, differenceInHours(eventDate, now) % 24);
      const minutes = Math.max(0, differenceInMinutes(eventDate, now) % 60);

      return { days, hours, minutes };
    },
    [currentTime],
  );

  const timeRemaining = getTimeRemaining(
    nextEvent?.nextEventDate || new Date(),
  );

  // Check if next event is overdue
  const isNextEventOverdue = nextEvent
    ? isPast(nextEvent.nextEventDate)
    : false;

  const handleCyclePress = useCallback((cycle: CycleData) => {
    setSelectedCycle(cycle);
    setShowDetailModal(true);
  }, []);

  // Render item for FlatList optimization
  const renderCycleItem: ListRenderItem<CycleData> = useCallback(
    ({ item }) => (
      <TouchableOpacity
        className="mb-4"
        onPress={() => handleCyclePress(item)}
        activeOpacity={0.7}
      >
        <ActiveCycleCard
          cycleName={item.cycleName}
          cycleNumber={item.cycleNumber}
          totalCycles={item.totalCycles}
          status={item.status}
          memberCount={item.memberCount}
          progressPercentage={item.progressPercentage}
          paymentStatus={item.paymentStatus}
          dueDate={item.dueDate}
          contributionAmount={item.contributionAmount}
          onPress={() => handleCyclePress(item)}
        />
      </TouchableOpacity>
    ),
    [handleCyclePress],
  );

  // Calculate overall progress statistics with proper typing
  const totalContributed: number = activeCycles.reduce((sum, cycle) => {
    const amount = parseInt(cycle.contributionAmount.replace(/[₱,]/g, ""));
    return sum + amount * cycle.cycleNumber;
  }, 0);

  const totalReceived: number = 5000; // This would come from actual data
  const overallProgress: number =
    activeCycles.reduce((sum, cycle) => sum + cycle.progressPercentage, 0) /
    activeCycles.length;

  if (isLoading) {
    return (
      <SafeAreaView
        className={`flex-1 ${isDark ? "bg-gray-900" : "bg-indigo-600"}`}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor={isDark ? "#111827" : "#4F46E5"}
        />
        <View className="flex-1 justify-center items-center">
          <View className="items-center">
            <View
              className={`w-24 h-24 rounded-full items-center justify-center mb-8 shadow-lg ${isDark ? "bg-gray-800" : "bg-white"}`}
            >
              <TrendingUp size={48} color={isDark ? "#ffffff" : "#4F46E5"} />
            </View>

            <Text className="text-4xl font-bold text-white mb-2">
              PaluChain Go
            </Text>

            <Text
              className={`text-lg mb-12 text-center px-8 ${isDark ? "text-gray-300" : "text-indigo-200"}`}
            >
              Your trusted paluwagan companion
            </Text>

            <ActivityIndicator size="large" color="#ffffff" />
            <Text className="text-white mt-4 text-base">
              Loading your cycles...
            </Text>
          </View>

          <View className="absolute bottom-12 items-center">
            <Text
              className={`text-sm ${isDark ? "text-gray-400" : "text-indigo-300"}`}
            >
              Powered by blockchain technology
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-gray-900" : "bg-white"}`}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={isDark ? "#111827" : "#ffffff"}
      />

      <View
        className={`flex-row justify-between items-center px-4 py-3 border-b ${isDark ? "border-gray-700" : "border-gray-100"}`}
      >
        <Text
          className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}
        >
          PaluChain Go
        </Text>
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={walletAddress ? disconnectWallet : connectWallet}
            disabled={isConnecting}
            className={`flex-row items-center px-3 py-2 rounded-lg mr-2 ${walletAddress ? (isDark ? "bg-green-800" : "bg-green-100") : isDark ? "bg-indigo-800" : "bg-indigo-100"}`}
            accessibilityLabel={
              walletAddress
                ? `Disconnect wallet ${walletAddress}`
                : "Connect wallet"
            }
            accessibilityRole="button"
          >
            <Wallet size={16} color={walletAddress ? "#059669" : "#4F46E5"} />
            {isConnecting ? (
              <ActivityIndicator
                size="small"
                color={"#4F46E5"}
                className="ml-1"
              />
            ) : (
              <Text
                className={`ml-1 text-xs font-medium ${walletAddress ? (isDark ? "text-green-200" : "text-green-700") : isDark ? "text-indigo-200" : "text-indigo-700"}`}
              >
                {walletAddress
                  ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
                  : "Connect"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="p-2 mr-2 relative"
            accessibilityLabel="Notifications"
            accessibilityRole="button"
          >
            <Bell size={24} color={isDark ? "#ffffff" : "#333"} />
            <View className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
          </TouchableOpacity>
          <TouchableOpacity
            className="p-2"
            onPress={() => setShowSettingsModal(true)}
            accessibilityLabel="Settings"
            accessibilityRole="button"
          >
            <Settings size={24} color={isDark ? "#ffffff" : "#333"} />
          </TouchableOpacity>
        </View>
      </View>

      <View className={`flex-1 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
        {walletAddress && (
          <View
            className={`mx-4 mt-4 mb-2 rounded-xl p-4 border ${isDark ? "bg-green-900 border-green-700" : "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"}`}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View
                  className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${isDark ? "bg-green-800" : "bg-green-100"}`}
                >
                  <Wallet size={16} color="#059669" />
                </View>
                <View>
                  <Text
                    className={`text-sm font-semibold ${isDark ? "text-green-200" : "text-green-800"}`}
                  >
                    Wallet Connected
                  </Text>
                  <Text
                    className={`text-xs ${isDark ? "text-green-300" : "text-green-600"}`}
                  >
                    {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
                  </Text>
                </View>
              </View>
              <View
                className={`w-2 h-2 rounded-full ${isDark ? "bg-green-400" : "bg-green-500"}`}
              />
            </View>
          </View>
        )}

        <View
          className={`px-4 py-4 mb-2 ${isDark ? "bg-gray-900" : "bg-white"}`}
        >
          <View className="flex-row items-center mb-3">
            <TrendingUp size={20} color="#4F46E5" />
            <Text
              className={`text-lg font-semibold ml-2 ${isDark ? "text-white" : "text-gray-800"}`}
            >
              Overall Progress
            </Text>
          </View>

          <View
            className={`rounded-xl p-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}
          >
            <View className="flex-row justify-between items-center mb-2">
              <Text
                className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
              >
                Cycle Completion
              </Text>
              <Text
                className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-800"}`}
              >
                {Math.round(overallProgress)}%
              </Text>
            </View>
            <View
              className={`h-3 w-full rounded-full overflow-hidden mb-3 ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
            >
              <View
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                style={{ width: `${overallProgress}%` }}
              />
            </View>

            <View className="flex-row justify-between">
              <View className="items-center">
                <Text
                  className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Active Cycles
                </Text>
                <Text
                  className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-800"}`}
                >
                  {activeCycles.length}
                </Text>
              </View>
              <View className="items-center">
                <Text
                  className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Total Members
                </Text>
                <Text
                  className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-800"}`}
                >
                  {activeCycles.reduce(
                    (sum, cycle) => sum + cycle.memberCount,
                    0,
                  )}
                </Text>
              </View>
              <View className="items-center">
                <Text
                  className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Contributed
                </Text>
                <Text
                  className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-800"}`}
                >
                  ₱{totalContributed.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="px-4 py-4">
          <View className="flex-row items-center mb-3">
            <Calendar size={20} color="#F59E0B" />
            <Text
              className={`text-lg font-semibold ml-2 ${isDark ? "text-white" : "text-gray-800"}`}
            >
              Next Event
            </Text>
          </View>

          {nextEvent && (
            <NextEventCard
              eventType={
                nextEvent.paymentStatus === "missed"
                  ? "contribution"
                  : nextEvent.nextEventType
              }
              amount={nextEvent.nextEventAmount}
              dueDate={nextEvent.dueDate}
              daysRemaining={timeRemaining.days}
              hoursRemaining={timeRemaining.hours}
              minutesRemaining={timeRemaining.minutes}
              isOverdue={isNextEventOverdue}
              onPress={() => handleCyclePress(nextEvent)}
            />
          )}
        </View>

        <View className="px-4 py-2 mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Users size={20} color="#10B981" />
              <Text
                className={`text-lg font-semibold ml-2 ${isDark ? "text-white" : "text-gray-800"}`}
              >
                Active Cycles
              </Text>
            </View>
            <TouchableOpacity
              className={`flex-row items-center px-3 py-2 rounded-lg ${isDark ? "bg-indigo-800" : "bg-indigo-50"}`}
              accessibilityLabel="Create new cycle"
              accessibilityRole="button"
            >
              <Plus size={16} color="#4F46E5" />
              <Text
                className={`ml-1 font-medium ${isDark ? "text-indigo-200" : "text-indigo-600"}`}
              >
                New Cycle
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={activeCycles}
            renderItem={renderCycleItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>

        <View
          className={`px-4 py-4 mb-6 rounded-xl mx-4 shadow-sm border ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"}`}
        >
          <Text
            className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-800"}`}
          >
            Financial Summary
          </Text>

          <View>
            <View className="flex-row justify-between items-center py-2">
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                <Text
                  className={`${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  Total Contributed
                </Text>
              </View>
              <Text
                className={`font-bold ${isDark ? "text-white" : "text-gray-800"}`}
              >
                ₱{totalContributed.toLocaleString()}
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-2">
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                <Text
                  className={`${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  Total Received
                </Text>
              </View>
              <Text
                className={`font-bold ${isDark ? "text-green-400" : "text-green-600"}`}
              >
                ₱{totalReceived.toLocaleString()}
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-2">
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
                <Text
                  className={`${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  Net Position
                </Text>
              </View>
              <Text
                className={`font-bold ${totalReceived - totalContributed >= 0 ? (isDark ? "text-green-400" : "text-green-600") : isDark ? "text-red-400" : "text-red-600"}`}
              >
                ₱{(totalReceived - totalContributed).toLocaleString()}
              </Text>
            </View>

            <View
              className={`border-t pt-3 mt-2 ${isDark ? "border-gray-700" : "border-gray-100"}`}
            >
              <View className="flex-row justify-between items-center">
                <Text
                  className={`${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  Active Cycles
                </Text>
                <View className="flex-row items-center">
                  <View
                    className={`w-6 h-6 rounded-full items-center justify-center mr-2 ${isDark ? "bg-indigo-800" : "bg-indigo-100"}`}
                  >
                    <Text
                      className={`text-xs font-bold ${isDark ? "text-indigo-200" : "text-indigo-600"}`}
                    >
                      {activeCycles.length}
                    </Text>
                  </View>
                  <Text
                    className={`font-semibold ${isDark ? "text-white" : "text-gray-800"}`}
                  >
                    Groups
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {showDetailModal && (
        <CycleDetailModal
          isVisible={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          cycleName={selectedCycle?.cycleName}
          cycleStatus={selectedCycle?.status}
          currentAmount={selectedCycle?.currentPoolAmount}
          targetAmount={selectedCycle?.totalPoolAmount}
        />
      )}

      {showSettingsModal && (
        <SettingsModal
          isVisible={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </SafeAreaView>
  );
}
