import fs from 'fs';
import path from 'path';
import { Habit, CheckIn, UserHabits, UserRecords } from './types';

// 习惯配置文件路径
const HABITS_DIR = path.join(__dirname, 'habits');
// 打卡记录文件路径
const RECORDS_DIR = path.join(__dirname, 'records');

// 确保目录存在
const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// 读取用户习惯配置
export const readUserHabits = (userId: string): Habit[] => {
  const filePath = path.join(HABITS_DIR, `${userId}.json`);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const content = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(content) as Habit[];
};

// 写入用户习惯配置
export const writeUserHabits = (userId: string, habits: Habit[]): void => {
  ensureDir(HABITS_DIR);
  const filePath = path.join(HABITS_DIR, `${userId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(habits, null, 2));
};

// 读取用户打卡记录（按月）
export const readUserRecords = (userId: string, month: string): CheckIn[] => {
  const userDir = path.join(RECORDS_DIR, userId);
  const filePath = path.join(userDir, `${month}.json`);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const content = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(content) as CheckIn[];
};

// 写入用户打卡记录（按月）
export const writeUserRecords = (userId: string, month: string, records: CheckIn[]): void => {
  const userDir = path.join(RECORDS_DIR, userId);
  ensureDir(userDir);
  const filePath = path.join(userDir, `${month}.json`);
  fs.writeFileSync(filePath, JSON.stringify(records, null, 2));
};

// 生成唯一ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// 获取当前月份（YYYY-MM格式）
export const getCurrentMonth = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};
