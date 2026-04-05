// 习惯类型定义
export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  dailyGoal: number;
  reminderTime?: string;
}

// 打卡记录类型定义
export interface CheckIn {
  id: string;
  habitId: string;
  timestamp: number;
  note?: string;
}
