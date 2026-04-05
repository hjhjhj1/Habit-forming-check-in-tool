import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { CheckInRecord } from '../types';
import { getRecords, saveRecords } from '../dataStore';

const router = Router();

router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const { yearMonth } = req.query;
  
  if (!yearMonth) {
    return res.status(400).json({ error: 'yearMonth is required' });
  }
  
  const records = getRecords(userId, yearMonth as string);
  res.json(records);
});

router.post('/:userId', (req, res) => {
  const { userId } = req.params;
  const { habitId, date, note } = req.body;
  
  if (!habitId || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const yearMonth = date.substring(0, 7);
  const records = getRecords(userId, yearMonth);
  
  const newRecord: CheckInRecord = {
    id: uuidv4(),
    habitId,
    date,
    timestamp: new Date().toISOString(),
    note
  };
  
  records.push(newRecord);
  saveRecords(userId, yearMonth, records);
  res.json(newRecord);
});

router.delete('/:userId/:recordId', (req, res) => {
  const { userId, recordId } = req.params;
  const { yearMonth } = req.query;
  
  if (!yearMonth) {
    return res.status(400).json({ error: 'yearMonth is required' });
  }
  
  const records = getRecords(userId, yearMonth as string);
  const filteredRecords = records.filter(r => r.id !== recordId);
  
  saveRecords(userId, yearMonth as string, filteredRecords);
  res.json({ success: true });
});

export default router;
