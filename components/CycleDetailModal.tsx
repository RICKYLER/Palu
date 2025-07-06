import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ListRenderItem,
} from "react-native";
import { BlurView } from "expo-blur";
import {
  Calendar,
  Clock,
  Users,
  Book,
  ArrowLeft,
  CreditCard,
  CheckCircle,
  AlertCircle,
} from "lucide-react-native";
import { Member, Event } from "../types";

interface CycleDetailModalProps {
  isVisible?: boolean;
  onClose?: () => void;
  cycleName?: string;
  cycleStatus?: "ongoing" | "completed" | "upcoming";
  currentAmount?: number;
  targetAmount?: number;
  startDate?: string;
  endDate?: string;
  members?: Member[];
  events?: Event[];
  rules?: string[];
  canContribute?: boolean;
  canClaim?: boolean;
}

const CycleDetailModal: React.FC<CycleDetailModalProps> = ({
  isVisible = true,
  onClose = () => {},
  cycleName = "Office Friends Paluwagan",
  cycleStatus = "ongoing",
  currentAmount = 15000,
  targetAmount = 30000,
  startDate = "June 1, 2023",
  endDate = "December 1, 2023",
  members = [
    {
      id: "1",
      name: "Juan Dela Cruz",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=juan",
      status: "paid",
    },
    {
      id: "2",
      name: "Maria Santos",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
      status: "paid",
    },
    {
      id: "3",
      name: "Pedro Reyes",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pedro",
      status: "pending",
    },
    {
      id: "4",
      name: "Ana Gonzales",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ana",
      status: "missed",
    },
    {
      id: "5",
      name: "Carlos Tan",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos",
      status: "paid",
    },
    {
      id: "6",
      name: "Sofia Lim",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sofia",
      status: "paid",
    },
  ],
  events = [
    {
      id: "1",
      date: "July 15, 2023",
      type: "payout",
      amount: 5000,
      recipient: "Juan Dela Cruz",
    },
    {
      id: "2",
      date: "August 15, 2023",
      type: "payout",
      amount: 5000,
      recipient: "Maria Santos",
    },
    {
      id: "3",
      date: "September 15, 2023",
      type: "payout",
      amount: 5000,
      recipient: "Pedro Reyes",
    },
    {
      id: "4",
      date: "October 15, 2023",
      type: "payout",
      amount: 5000,
      recipient: "Ana Gonzales",
    },
    {
      id: "5",
      date: "November 15, 2023",
      type: "payout",
      amount: 5000,
      recipient: "Carlos Tan",
    },
    {
      id: "6",
      date: "December 15, 2023",
      type: "payout",
      amount: 5000,
      recipient: "Sofia Lim",
    },
  ],
  rules = [
    "Monthly contribution of ₱5,000",
    "Payments due by the 10th of each month",
    "Missed payments incur a 5% penalty",
    "Withdrawal from group requires unanimous approval",
    "Payout order determined at cycle start",
  ],
  canContribute = true,
  canClaim = false,
}) => {
  const [activeTab, setActiveTab] = useState<"members" | "events" | "rules">(
    "members",
  );

  if (!isVisible) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "missed":
        return "bg-red-100 text-red-700";
      case "ongoing":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "upcoming":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle size={16} color="#15803d" />;
      case "pending":
        return <Clock size={16} color="#a16207" />;
      case "missed":
        return <AlertCircle size={16} color="#b91c1c" />;
      default:
        return null;
    }
  };

  const renderMemberItem: ListRenderItem<Member> = ({ item }) => (
    <View className="flex-row items-center p-3 border-b border-gray-200">
      <View className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
        <Text className="text-center leading-10">{item.name.charAt(0)}</Text>
      </View>
      <View className="flex-1 ml-3">
        <Text className="font-medium">{item.name}</Text>
      </View>
      <View
        className={`px-2 py-1 rounded-full flex-row items-center ${getStatusColor(item.status)}`}
      >
        {getStatusIcon(item.status)}
        <Text
          className={`ml-1 text-xs capitalize ${getStatusColor(item.status)}`}
        >
          {item.status}
        </Text>
      </View>
    </View>
  );

  const renderEventItem: ListRenderItem<Event> = ({ item }) => (
    <View className="p-3 border-b border-gray-200">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          {item.type === "payout" ? (
            <View className="w-8 h-8 rounded-full bg-green-100 items-center justify-center mr-2">
              <CreditCard size={16} color="#15803d" />
            </View>
          ) : (
            <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-2">
              <CreditCard size={16} color="#1d4ed8" />
            </View>
          )}
          <View>
            <Text className="font-medium">
              {item.type === "payout" ? "Payout" : "Contribution"}
            </Text>
            <Text className="text-xs text-gray-500">{item.date}</Text>
          </View>
        </View>
        <View>
          <Text className="font-bold text-right">
            ₱{item.amount.toLocaleString()}
          </Text>
          {item.recipient && (
            <Text className="text-xs text-gray-500 text-right">
              To: {item.recipient}
            </Text>
          )}
        </View>
      </View>
    </View>
  );

  const renderRuleItem = ({ item, index }: { item: string; index: number }) => (
    <View className="flex-row mb-2 items-start">
      <Text className="text-gray-700 mr-2">{index + 1}.</Text>
      <Text className="text-gray-700 flex-1">{item}</Text>
    </View>
  );

  return (
    <View className="absolute inset-0 bg-black bg-opacity-50 justify-center items-center z-50">
      <BlurView intensity={10} className="absolute inset-0" />
      <View className="bg-white w-[90%] max-h-[80%] rounded-xl overflow-hidden">
        {/* Header */}
        <View className="p-4 border-b border-gray-200 flex-row justify-between items-center bg-white">
          <TouchableOpacity onPress={onClose} className="p-2">
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-xl font-bold">{cycleName}</Text>
          <View className="w-8"></View> {/* Empty view for balance */}
        </View>

        {/* Cycle Summary */}
        <View className="p-4 bg-gray-50">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-500">Status</Text>
            <View
              className={`px-2 py-1 rounded-full ${getStatusColor(cycleStatus)}`}
            >
              <Text
                className={`text-xs capitalize ${getStatusColor(cycleStatus)}`}
              >
                {cycleStatus}
              </Text>
            </View>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-500">Progress</Text>
            <Text className="font-medium">
              ₱{currentAmount.toLocaleString()} / ₱
              {targetAmount.toLocaleString()}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-500">Duration</Text>
            <Text className="font-medium">
              {startDate} - {endDate}
            </Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View className="flex-row border-b border-gray-200">
          <TouchableOpacity
            onPress={() => setActiveTab("members")}
            className={`flex-1 py-3 flex-row justify-center items-center ${activeTab === "members" ? "border-b-2 border-blue-500" : ""}`}
          >
            <Users
              size={16}
              color={activeTab === "members" ? "#3b82f6" : "#6b7280"}
            />
            <Text
              className={`ml-1 ${activeTab === "members" ? "text-blue-500 font-medium" : "text-gray-500"}`}
            >
              Members
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("events")}
            className={`flex-1 py-3 flex-row justify-center items-center ${activeTab === "events" ? "border-b-2 border-blue-500" : ""}`}
          >
            <Calendar
              size={16}
              color={activeTab === "events" ? "#3b82f6" : "#6b7280"}
            />
            <Text
              className={`ml-1 ${activeTab === "events" ? "text-blue-500 font-medium" : "text-gray-500"}`}
            >
              Events
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("rules")}
            className={`flex-1 py-3 flex-row justify-center items-center ${activeTab === "rules" ? "border-b-2 border-blue-500" : ""}`}
          >
            <Book
              size={16}
              color={activeTab === "rules" ? "#3b82f6" : "#6b7280"}
            />
            <Text
              className={`ml-1 ${activeTab === "rules" ? "text-blue-500 font-medium" : "text-gray-500"}`}
            >
              Rules
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View className="flex-1">
          {activeTab === "members" && (
            <FlatList
              data={members}
              renderItem={renderMemberItem}
              keyExtractor={(item) => item.id}
              className="bg-white"
            />
          )}
          {activeTab === "events" && (
            <FlatList
              data={events}
              renderItem={renderEventItem}
              keyExtractor={(item) => item.id}
              className="bg-white"
            />
          )}
          {activeTab === "rules" && (
            <ScrollView className="p-4 bg-white">
              {rules.map((rule, index) =>
                renderRuleItem({ item: rule, index }),
              )}
            </ScrollView>
          )}
        </View>

        {/* Action Buttons */}
        <View className="p-4 border-t border-gray-200 flex-row">
          {canContribute && (
            <TouchableOpacity
              className="flex-1 bg-blue-500 py-3 rounded-lg mr-2 items-center"
              accessibilityLabel="Contribute to cycle"
              accessibilityRole="button"
            >
              <Text className="text-white font-medium">Contribute</Text>
            </TouchableOpacity>
          )}
          {canClaim && (
            <TouchableOpacity
              className="flex-1 bg-green-500 py-3 rounded-lg items-center"
              accessibilityLabel="Claim payout"
              accessibilityRole="button"
            >
              <Text className="text-white font-medium">Claim Payout</Text>
            </TouchableOpacity>
          )}
          {!canContribute && !canClaim && (
            <TouchableOpacity
              className="flex-1 bg-gray-200 py-3 rounded-lg items-center"
              accessibilityLabel="No actions available"
              accessibilityRole="button"
              disabled
            >
              <Text className="text-gray-700 font-medium">
                No Actions Available
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default CycleDetailModal;
