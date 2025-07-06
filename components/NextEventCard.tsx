import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  Clock,
  AlertCircle,
  PartyPopper,
  AlertTriangle,
} from "lucide-react-native";

interface NextEventCardProps {
  eventType?: "payout" | "contribution";
  amount?: string;
  dueDate?: string;
  daysRemaining?: number;
  hoursRemaining?: number;
  minutesRemaining?: number;
  isOverdue?: boolean;
  onPress?: () => void;
}

const NextEventCard: React.FC<NextEventCardProps> = ({
  eventType = "payout",
  amount = "₱5,000",
  dueDate = "July 15",
  daysRemaining = 2,
  hoursRemaining = 5,
  minutesRemaining = 30,
  isOverdue = false,
  onPress = () => {},
}) => {
  const isPayout = eventType === "payout";
  const isContributionOverdue = !isPayout && isOverdue;

  // Determine card styling based on overdue status
  const getCardStyling = () => {
    if (isContributionOverdue) {
      return "bg-red-50 border-2 border-red-200";
    }
    return "bg-white shadow-md";
  };

  // Determine text color based on status
  const getTextColor = () => {
    if (isContributionOverdue) return "text-red-600";
    return isPayout ? "text-indigo-500" : "text-rose-500";
  };

  // Determine icon color
  const getIconColor = () => {
    if (isContributionOverdue) return "#DC2626";
    return isPayout ? "#6366F1" : "#F43F5E";
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`w-full rounded-xl p-4 mb-4 ${getCardStyling()}`}
      accessibilityLabel={`${isContributionOverdue ? "Overdue " : ""}${isPayout ? "Payout" : "Contribution"} of ${amount} ${isPayout ? "on" : "due by"} ${dueDate}`}
      accessibilityRole="button"
    >
      {/* Overdue Banner */}
      {isContributionOverdue && (
        <View className="flex-row items-center mb-3 bg-red-100 px-3 py-2 rounded-lg">
          <AlertTriangle size={16} color="#DC2626" />
          <Text className="ml-2 text-red-700 font-semibold text-sm">
            OVERDUE PAYMENT
          </Text>
        </View>
      )}

      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <View className="flex-row items-center mb-2">
            {isPayout ? (
              <PartyPopper size={20} color={getIconColor()} className="mr-2" />
            ) : (
              <AlertCircle size={20} color={getIconColor()} className="mr-2" />
            )}
            <Text className={`font-bold text-lg ${getTextColor()}`}>
              {isContributionOverdue
                ? "Overdue Contribution"
                : isPayout
                  ? "Upcoming Payout"
                  : "Contribution Due"}
            </Text>
          </View>

          <Text className="text-xl font-bold mb-1">
            {isPayout
              ? `You'll receive ${amount}`
              : `You need to pay ${amount}`}
          </Text>

          <Text
            className={`mb-3 ${isContributionOverdue ? "text-red-600" : "text-gray-600"}`}
          >
            {isPayout ? `Payout on ${dueDate}` : `Due by ${dueDate}`}
          </Text>

          <View className="flex-row items-center">
            <Clock
              size={16}
              color={isContributionOverdue ? "#DC2626" : "#6B7280"}
            />
            <Text
              className={`ml-1 ${isContributionOverdue ? "text-red-600" : "text-gray-500"}`}
            >
              {isOverdue ? (
                "Payment overdue"
              ) : (
                <>
                  {daysRemaining > 0 ? `${daysRemaining}d ` : ""}
                  {hoursRemaining > 0 ? `${hoursRemaining}h ` : ""}
                  {minutesRemaining}m remaining
                </>
              )}
            </Text>
          </View>
        </View>

        <View
          className={`h-16 w-16 rounded-full items-center justify-center ${
            isContributionOverdue
              ? "bg-red-100"
              : isPayout
                ? "bg-indigo-100"
                : "bg-rose-100"
          }`}
        >
          {isContributionOverdue ? (
            <Text className="text-3xl">⚠️</Text>
          ) : isPayout ? (
            <Text className="text-3xl">🎉</Text>
          ) : (
            <Text className="text-3xl">⏰</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NextEventCard;
