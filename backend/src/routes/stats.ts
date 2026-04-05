import { Router } from 'express';
import { getRecords, getHabits } from '../dataStore';

const router = Router();

router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const { yearMonth } = req.query;
  
  if (!yearMonth) {
    return res.status(400).json({ error: 'yearMonth is required' });
  }
  
  const habits = getHabits(userId);
  const records = getRecords(userId, yearMonth as string);
  
  const dailyStats: Record<string, Record<string, number>> = {};
  
  habits.forEach(habit => {
    dailyStats[habit.id] = {};
    records.forEach(record => {
      if (record.habitId === habit.id) {
        const day = record.date.substring(8, 10);
        dailyStats[habit.id][day] = (dailyStats[habit.id][day] || 0) + 1;
      }
    });
  });
  
  res.json(dailyStats);
});

export default router;
