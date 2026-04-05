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

// 用户习惯配置类型
export interface UserHabits {
  [userId: string]: Habit[];
}

// 用户打卡记录类型（按月分）
export interface UserRecords {
  [userId: string]: {
    [month: string]: CheckIn[];
  };
}
