import { defineStore } from 'pinia';
import { habitApi, recordApi } from '../api';

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

export const useHabitStore = defineStore('habit', {
  state: () => ({
    habits: [] as Habit[],
    records: [] as CheckIn[],
    userId: 'default', // 默认用户ID
    loading: false,
    error: null as string | null
  }),

  getters: {
    getHabitById: (state) => (id: string) => {
      return state.habits.find(habit => habit.id === id);
    },

    getRecordsByHabitId: (state) => (habitId: string) => {
      return state.records.filter(record => record.habitId === habitId);
    }
  },

  actions: {
    // 加载用户习惯
    async loadHabits() {
      this.loading = true;
      try {
        this.habits = await habitApi.getHabits(this.userId);
      } catch (error) {
        this.error = 'Failed to load habits';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    // 加载用户打卡记录（按月）
    async loadRecords(month: string) {
      this.loading = true;
      try {
        this.records = await recordApi.getRecords(this.userId, month);
      } catch (error) {
        this.error = 'Failed to load records';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    // 创建新习惯
    async createHabit(habit: Omit<Habit, 'id'>) {
      this.loading = true;
      try {
        const newHabit = await habitApi.createHabit(this.userId, habit);
        this.habits.push(newHabit);
        return newHabit;
      } catch (error) {
        this.error = 'Failed to create habit';
        console.error(error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    // 更新习惯
    async updateHabit(habitId: string, habit: Partial<Habit>) {
      this.loading = true;
      try {
        const updatedHabit = await habitApi.updateHabit(this.userId, habitId, habit);
        const index = this.habits.findIndex(h => h.id === habitId);
        if (index !== -1) {
          this.habits[index] = updatedHabit;
        }
        return updatedHabit;
      } catch (error) {
        this.error = 'Failed to update habit';
        console.error(error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    // 删除习惯
    async deleteHabit(habitId: string) {
      this.loading = true;
      try {
        await habitApi.deleteHabit(this.userId, habitId);
        this.habits = this.habits.filter(h => h.id !== habitId);
        this.records = this.records.filter(r => r.habitId !== habitId);
        return true;
      } catch (error) {
        this.error = 'Failed to delete habit';
        console.error(error);
        return false;
      } finally {
        this.loading = false;
      }
    },

    // 打卡
    async checkIn(habitId: string, note?: string) {
      this.loading = true;
      try {
        const checkIn = await recordApi.createCheckIn(this.userId, { habitId, note });
        this.records.push(checkIn);
        return checkIn;
      } catch (error) {
        this.error = 'Failed to check in';
        console.error(error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    // 删除打卡记录
    async deleteCheckIn(recordId: string) {
      this.loading = true;
      try {
        const record = this.records.find(r => r.id === recordId);
        if (!record) {
          throw new Error('Record not found');
        }
        const month = new Date(record.timestamp).toISOString().slice(0, 7);
        await recordApi.deleteCheckIn(this.userId, month, recordId);
        this.records = this.records.filter(r => r.id !== recordId);
        return true;
      } catch (error) {
        this.error = 'Failed to delete check-in';
        console.error(error);
        return false;
      } finally {
        this.loading = false;
      }
    }
  }
});
