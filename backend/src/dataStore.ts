import fs from 'fs';
import path from 'path';
import { Habit, CheckInRecord } from './types';

const DATA_DIR = path.join(__dirname, '../data');
const HABITS_DIR = path.join(DATA_DIR, 'habits');
const RECORDS_DIR = path.join(DATA_DIR, 'records');

const ensureDirExists = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const getUserHabitsPath = (userId: string) => path.join(HABITS_DIR, `${userId}.json`);
const getUserRecordsPath = (userId: string, yearMonth: string) => 
  path.join(RECORDS_DIR, userId, `${yearMonth}.json`);

export const initDataStore = () => {
  ensureDirExists(HABITS_DIR);
  ensureDirExists(RECORDS_DIR);
};

export const getHabits = (userId: string): Habit[] => {
  const filePath = getUserHabitsPath(userId);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

export const saveHabits = (userId: string, habits: Habit[]) => {
  ensureDirExists(HABITS_DIR);
  fs.writeFileSync(getUserHabitsPath(userId), JSON.stringify(habits, null, 2));
};

export const getRecords = (userId: string, yearMonth: string): CheckInRecord[] => {
  const filePath = getUserRecordsPath(userId, yearMonth);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

export const saveRecords = (userId: string, yearMonth: string, records: CheckInRecord[]) => {
  const userRecordsDir = path.join(RECORDS_DIR, userId);
  ensureDirExists(userRecordsDir);
  fs.writeFileSync(getUserRecordsPath(userId, yearMonth), JSON.stringify(records, null, 2));
};
