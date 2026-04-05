import express from 'express';
import cors from 'cors';
import { Habit, CheckIn } from './types';
import { readUserHabits, writeUserHabits, readUserRecords, writeUserRecords, generateId, getCurrentMonth } from './utils';

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 习惯管理接口

// 获取用户习惯列表
app.get('/api/habits/:userId', (req, res) => {
  const { userId } = req.params;
  const habits = readUserHabits(userId);
  res.json(habits);
});

// 创建新习惯
app.post('/api/habits/:userId', (req, res) => {
  const { userId } = req.params;
  const habitData: Omit<Habit, 'id'> = req.body;
  const habits = readUserHabits(userId);
  const newHabit: Habit = {
    ...habitData,
    id: generateId()
  };
  habits.push(newHabit);
  writeUserHabits(userId, habits);
  res.json(newHabit);
});

// 更新习惯
app.put('/api/habits/:userId/:habitId', (req, res) => {
  const { userId, habitId } = req.params;
  const habitData: Partial<Habit> = req.body;
  const habits = readUserHabits(userId);
  const index = habits.findIndex(h => h.id === habitId);
  if (index === -1) {
    res.status(404).json({ error: 'Habit not found' });
    return;
  }
  habits[index] = { ...habits[index], ...habitData };
  writeUserHabits(userId, habits);
  res.json(habits[index]);
});

// 删除习惯
app.delete('/api/habits/:userId/:habitId', (req, res) => {
  const { userId, habitId } = req.params;
  const habits = readUserHabits(userId);
  const filteredHabits = habits.filter(h => h.id !== habitId);
  writeUserHabits(userId, filteredHabits);
  res.json({ message: 'Habit deleted' });
});

// 打卡记录接口

// 获取用户打卡记录（按月）
app.get('/api/records/:userId/:month', (req, res) => {
  const { userId, month } = req.params;
  const records = readUserRecords(userId, month);
  res.json(records);
});

// 打卡
app.post('/api/records/:userId', (req, res) => {
  const { userId } = req.params;
  const checkInData: Omit<CheckIn, 'id' | 'timestamp'> = req.body;
  const month = getCurrentMonth();
  const records = readUserRecords(userId, month);
  const newCheckIn: CheckIn = {
    ...checkInData,
    id: generateId(),
    timestamp: Date.now()
  };
  records.push(newCheckIn);
  writeUserRecords(userId, month, records);
  res.json(newCheckIn);
});

// 删除打卡记录
app.delete('/api/records/:userId/:month/:recordId', (req, res) => {
  const { userId, month, recordId } = req.params;
  const records = readUserRecords(userId, month);
  const filteredRecords = records.filter(r => r.id !== recordId);
  writeUserRecords(userId, month, filteredRecords);
  res.json({ message: 'Check-in deleted' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
