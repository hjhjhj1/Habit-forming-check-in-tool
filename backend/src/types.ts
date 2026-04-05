export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  dailyTarget: number;
  reminderTime?: string;
  createdAt: string;
  isActive: boolean;
}

export interface CheckInRecord {
  id: string;
  habitId: string;
  date: string;
  timestamp: string;
  note?: string;
}

export interface DailyStats {
  date: string;
  checkIns: number;
}
