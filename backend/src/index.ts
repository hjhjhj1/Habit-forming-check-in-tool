import express from 'express';
import cors from 'cors';
import habitsRoutes from './routes/habits';
import recordsRoutes from './routes/records';
import statsRoutes from './routes/stats';
import { initDataStore } from './dataStore';

const app = express();
const PORT = process.env.PORT || 3001;

initDataStore();

app.use(cors());
app.use(express.json());

app.use('/api/habits', habitsRoutes);
app.use('/api/records', recordsRoutes);
app.use('/api/stats', statsRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Habit Tracker API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
