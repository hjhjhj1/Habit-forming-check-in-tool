import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Habit } from '../types';
import { getHabits, saveHabits } from '../dataStore';

const router = Router();

router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const habits = getHabits(userId);
  res.json(habits);
});

router.post('/:userId', (req, res) => {
  const { userId } = req.params;
  const { name, icon, color, dailyTarget, reminderTime } = req.body;
  
  if (!name || !icon || !color || !dailyTarget) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const habits = getHabits(userId);
  const newHabit: Habit = {
    id: uuidv4(),
    name,
    icon,
    color,
    dailyTarget,
    reminderTime,
    createdAt: new Date().toISOString(),
    isActive: true
  };
  
  habits.push(newHabit);
  saveHabits(userId, habits);
  res.json(newHabit);
});

router.put('/:userId/:habitId', (req, res) => {
  const { userId, habitId } = req.params;
  const { name, icon, color, dailyTarget, reminderTime, isActive } = req.body;
  
  const habits = getHabits(userId);
  const habitIndex = habits.findIndex(h => h.id === habitId);
  
  if (habitIndex === -1) {
    return res.status(404).json({ error: 'Habit not found' });
  }

  habits[habitIndex] = {
    ...habits[habitIndex],
    name: name || habits[habitIndex].name,
    icon: icon || habits[habitIndex].icon,
    color: color || habits[habitIndex].color,
    dailyTarget: dailyTarget || habits[habitIndex].dailyTarget,
    reminderTime: reminderTime !== undefined ? reminderTime : habits[habitIndex].reminderTime,
    isActive: isActive !== undefined ? isActive : habits[habitIndex].isActive
  };
  
  saveHabits(userId, habits);
  res.json(habits[habitIndex]);
});

router.delete('/:userId/:habitId', (req, res) => {
  const { userId, habitId } = req.params;
  const habits = getHabits(userId);
  const filteredHabits = habits.filter(h => h.id !== habitId);
  
  saveHabits(userId, filteredHabits);
  res.json({ success: true });
});

export default router;
