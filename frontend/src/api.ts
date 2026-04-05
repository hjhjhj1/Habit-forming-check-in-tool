import axios from 'axios';
import { Habit, CheckInRecord } from './types';

const API_BASE = '/api';
const USER_ID = 'default';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getHabits = async (): Promise<Habit[]> => {
  const response = await api.get(`/habits/${USER_ID}`);
  return response.data;
};

export const createHabit = async (habit: Omit<Habit, 'id' | 'createdAt' | 'isActive'>): Promise<Habit> => {
  const response = await api.post(`/habits/${USER_ID}`, habit);
  return response.data;
};

export const updateHabit = async (habitId: string, habit: Partial<Habit>): Promise<Habit> => {
  const response = await api.put(`/habits/${USER_ID}/${habitId}`, habit);
  return response.data;
};

export const deleteHabit = async (habitId: string): Promise<void> => {
  await api.delete(`/habits/${USER_ID}/${habitId}`);
};

export const getRecords = async (yearMonth: string): Promise<CheckInRecord[]> => {
  const response = await api.get(`/records/${USER_ID}`, { params: { yearMonth } });
  return response.data;
};

export const checkIn = async (habitId: string, date: string, note?: string): Promise<CheckInRecord> => {
  const response = await api.post(`/records/${USER_ID}`, { habitId, date, note });
  return response.data;
};

export const deleteRecord = async (recordId: string, yearMonth: string): Promise<void> => {
  await api.delete(`/records/${USER_ID}/${recordId}`, { params: { yearMonth } });
};

export const getStats = async (yearMonth: string): Promise<Record<string, Record<string, number>>> => {
  const response = await api.get(`/stats/${USER_ID}`, { params: { yearMonth } });
  return response.data;
};
