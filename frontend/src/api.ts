import axios from 'axios';

interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  dailyGoal: number;
  reminderTime?: string;
}

interface CheckIn {
  id: string;
  habitId: string;
  timestamp: number;
  note?: string;
}

const API_BASE_URL = 'http://localhost:3000/api';

// 习惯相关 API
export const habitApi = {
  // 获取用户习惯列表
  getHabits: async (userId: string): Promise<Habit[]> => {
    const response = await axios.get(`${API_BASE_URL}/habits/${userId}`);
    return response.data;
  },

  // 创建新习惯
  createHabit: async (userId: string, habit: Omit<Habit, 'id'>): Promise<Habit> => {
    const response = await axios.post(`${API_BASE_URL}/habits/${userId}`, habit);
    return response.data;
  },

  // 更新习惯
  updateHabit: async (userId: string, habitId: string, habit: Partial<Habit>): Promise<Habit> => {
    const response = await axios.put(`${API_BASE_URL}/habits/${userId}/${habitId}`, habit);
    return response.data;
  },

  // 删除习惯
  deleteHabit: async (userId: string, habitId: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/habits/${userId}/${habitId}`);
  }
};

// 打卡记录相关 API
export const recordApi = {
  // 获取用户打卡记录（按月）
  getRecords: async (userId: string, month: string): Promise<CheckIn[]> => {
    const response = await axios.get(`${API_BASE_URL}/records/${userId}/${month}`);
    return response.data;
  },

  // 打卡
  createCheckIn: async (userId: string, checkIn: Omit<CheckIn, 'id' | 'timestamp'>): Promise<CheckIn> => {
    const response = await axios.post(`${API_BASE_URL}/records/${userId}`, checkIn);
    return response.data;
  },

  // 删除打卡记录
  deleteCheckIn: async (userId: string, month: string, recordId: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/records/${userId}/${month}/${recordId}`);
  }
};
