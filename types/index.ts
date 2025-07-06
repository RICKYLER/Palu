export interface CycleData {
  id: string;
  cycleName: string;
  cycleNumber: number;
  totalCycles: number;
  status: "ongoing" | "completed" | "upcoming";
  memberCount: number;
  progressPercentage: number;
  paymentStatus: "paid" | "due" | "missed";
  dueDate: string;
  contributionAmount: string;
  nextEventDate: Date;
  nextEventType: "payout" | "contribution";
  nextEventAmount: string;
  totalPoolAmount: number;
  currentPoolAmount: number;
}

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
}

export interface Member {
  id: string;
  name: string;
  avatar: string;
  status: "paid" | "pending" | "missed";
}

export interface Event {
  id: string;
  date: string;
  type: "contribution" | "payout";
  amount: number;
  recipient?: string;
}
