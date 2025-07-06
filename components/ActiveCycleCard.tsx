import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AlertCircle, Users, Calendar } from "lucide-react-native";

interface ActiveCycleCardProps {
  cycleName?: string;
  cycleNumber?: number;
  totalCycles?: number;
  status?: "ongoing" | "completed" | "upcoming";
  memberCount?: number;
  progressPercentage?: number;
  paymentStatus?: "paid" | "due" | "missed";
  dueDate?: string;
  contributionAmount?: string;
  onPress?: () => void;
}

const ActiveCycleCard = ({
  cycleName = "Family Savings",
  cycleNumber = 3,
  totalCycles = 5,
  status = "ongoing",
  memberCount = 6,
  progressPercentage = 60,
  paymentStatus = "paid",
  dueDate = "July 10",
  contributionAmount = "₱1,000",
  onPress = () => {},
}: ActiveCycleCardProps) => {
  // Determine status color
  const getStatusColor = () => {
    switch (status) {
      case "ongoing":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "upcoming":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  // Determine payment status color and icon
  const getPaymentStatusInfo = () => {
    switch (paymentStatus) {
      case "paid":
        return {
          color: "text-green-600",
          bgColor: "bg-green-100",
          message: `Paid for ${dueDate}`,
        };
      case "due":
        return {
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
          message: `Due on ${dueDate}`,
        };
      case "missed":
        return {
          color: "text-red-600",
          bgColor: "bg-red-100",
          message: `Missed payment for ${dueDate}`,
        };
      default:
        return {
          color: "text-gray-600",
          bgColor: "bg-gray-100",
          message: "No payment info",
        };
    }
  };

  const paymentStatusInfo = getPaymentStatusInfo();

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl p-4 mb-4 shadow-md w-full"
      activeOpacity={0.7}
    >
      {/* Header with cycle name and payment status */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-bold text-gray-800">{cycleName}</Text>
        <View className={`px-3 py-1 rounded-full ${paymentStatusInfo.bgColor}`}>
          <Text className={`text-xs font-medium ${paymentStatusInfo.color}`}>
            {paymentStatusInfo.message}
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View className="mb-3">
        <View className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <View
            className="h-full bg-blue-500 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </View>
        <Text className="text-xs text-gray-600 mt-1">
          {progressPercentage}% completed
        </Text>
      </View>

      {/* Badges row */}
      <View className="flex-row justify-between mt-2">
        <View className="flex-row items-center">
          <Calendar size={14} color="#4B5563" />
          <Text className="text-xs text-gray-600 ml-1">
            Cycle: {cycleNumber} of {totalCycles}
          </Text>
        </View>

        <View className="flex-row items-center">
          <View className={`w-2 h-2 rounded-full ${getStatusColor()} mr-1`} />
          <Text className="text-xs text-gray-600">
            Status: {status.charAt(0).toUpperCase() + status.slice(1)}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Users size={14} color="#4B5563" />
          <Text className="text-xs text-gray-600 ml-1">
            Members: {memberCount}
          </Text>
        </View>
      </View>

      {/* Contribution amount */}
      <View className="mt-3 pt-3 border-t border-gray-100">
        <Text className="text-sm text-gray-700">
          Contribution: <Text className="font-bold">{contributionAmount}</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ActiveCycleCard;
