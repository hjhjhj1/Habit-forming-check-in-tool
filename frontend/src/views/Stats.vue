<template>
  <div>
    <div class="card">
      <div class="header">
        <h1>📊 统计数据</h1>
        <div class="month-selector">
          <button class="btn btn-secondary btn-sm" @click="prevMonth">◀</button>
          <span class="month-label">{{ currentMonthLabel }}</span>
          <button class="btn btn-secondary btn-sm" @click="nextMonth">▶</button>
        </div>
      </div>
    </div>

    <div id="export-section">
      <div class="card">
        <h2>🔥 连续打卡</h2>
        <div class="streak-container">
          <div class="streak-item" v-for="habit in habits" :key="habit.id">
            <div class="streak-icon">{{ habit.icon }}</div>
            <div class="streak-info">
              <div class="streak-name">{{ habit.name }}</div>
              <div class="streak-count">{{ getStreak(habit.id) }} 天</div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <h2>📅 日历热力图</h2>
        <div class="calendar-container">
          <div class="calendar-header">
            <div v-for="day in weekDays" :key="day" class="calendar-day-header">{{ day }}</div>
          </div>
          <div class="calendar-grid">
            <div v-for="date in calendarDates" :key="date" class="calendar-day" :class="{ 'current-month': isCurrentMonth(date) }">
              <div class="calendar-day-number">{{ getDayNumber(date) }}</div>
              <div class="calendar-heat" :style="getHeatStyle(date)">
                <span class="heat-label">{{ getHeatLabel(date) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <h2>📈 完成率</h2>
        <div class="completion-container">
          <div class="completion-item" v-for="habit in habits" :key="habit.id">
            <div class="completion-header">
              <span class="completion-icon">{{ habit.icon }}</span>
              <span class="completion-name">{{ habit.name }}</span>
            </div>
            <div class="completion-bar">
              <div class="completion-fill" :style="{ width: getCompletionRate(habit.id) + '%', background: habit.color }"></div>
            </div>
            <div class="completion-rate">{{ getCompletionRate(habit.id) }}%</div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <h2>📤 数据导出</h2>
      <div class="export-buttons">
        <button class="btn btn-primary" @click="exportJSON">导出 JSON</button>
        <button class="btn btn-secondary" @click="exportImage">导出图片</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import { getHabits, getRecords, getStats } from '@/api';
import { Habit, CheckInRecord } from '@/types';

const habits = ref<Habit[]>([]);
const records = ref<CheckInRecord[]>([]);
const stats = ref<Record<string, Record<string, number>>>({});
const currentMonth = ref(dayjs());

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

const currentMonthLabel = computed(() => {
  return currentMonth.value.format('YYYY年MM月');
});

const calendarDates = computed(() => {
  const monthStart = currentMonth.value.startOf('month');
  const monthEnd = currentMonth.value.endOf('month');
  const startDate = monthStart.subtract(monthStart.day(), 'day');
  const dates = [];
  
  for (let i = 0; i < 42; i++) {
    dates.push(startDate.add(i, 'day').format('YYYY-MM-DD'));
  }
  
  return dates;
});

const loadData = async () => {
  const monthStr = currentMonth.value.format('YYYY-MM');
  const [habitsData, recordsData, statsData] = await Promise.all([
    getHabits(),
    getRecords(monthStr),
    getStats(monthStr)
  ]);
  habits.value = habitsData;
  records.value = recordsData;
  stats.value = statsData;
};

const prevMonth = () => {
  currentMonth.value = currentMonth.value.subtract(1, 'month');
  loadData();
};

const nextMonth = () => {
  currentMonth.value = currentMonth.value.add(1, 'month');
  loadData();
};

const isCurrentMonth = (date: string) => {
  return dayjs(date).format('YYYY-MM') === currentMonth.value.format('YYYY-MM');
};

const getDayNumber = (date: string) => {
  return dayjs(date).format('D');
};

const getHeatStyle = (date: string) => {
  if (!isCurrentMonth(date)) return {};
  
  const day = date.substring(8, 10);
  let totalCheckIns = 0;
  
  habits.value.forEach(habit => {
    totalCheckIns += stats.value[habit.id]?.[day] || 0;
  });
  
  const intensity = Math.min(totalCheckIns / 3, 1);
  const alpha = intensity * 0.8;
  
  return {
    background: `rgba(102, 126, 234, ${alpha})`
  };
};

const getHeatLabel = (date: string) => {
  if (!isCurrentMonth(date)) return '';
  
  const day = date.substring(8, 10);
  let totalCheckIns = 0;
  
  habits.value.forEach(habit => {
    totalCheckIns += stats.value[habit.id]?.[day] || 0;
  });
  
  return totalCheckIns > 0 ? totalCheckIns : '';
};

const getStreak = (habitId: string) => {
  const habitRecords = records.value.filter(r => r.habitId === habitId);
  const dates = [...new Set(habitRecords.map(r => r.date))].sort().reverse();
  
  if (dates.length === 0) return 0;
  
  let streak = 0;
  let currentDate = dayjs();
  
  for (const date of dates) {
    if (dayjs(date).isSame(currentDate, 'day')) {
      streak++;
      currentDate = currentDate.subtract(1, 'day');
    } else if (dayjs(date).isBefore(currentDate, 'day')) {
      break;
    }
  }
  
  return streak;
};

const getCompletionRate = (habitId: string) => {
  const habit = habits.value.find(h => h.id === habitId);
  if (!habit) return 0;
  
  const habitRecords = records.value.filter(r => r.habitId === habitId);
  const uniqueDates = new Set(habitRecords.map(r => r.date));
  const totalDays = currentMonth.value.daysInMonth();
  const completedDays = uniqueDates.size;
  
  return Math.round((completedDays / totalDays) * 100);
};

const exportJSON = () => {
  const data = {
    habits: habits.value,
    records: records.value,
    exportDate: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `habits-export-${dayjs().format('YYYY-MM-DD')}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

const exportImage = async () => {
  const element = document.getElementById('export-section');
  if (!element) return;
  
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#f3f4f6',
      scale: 2
    });
    
    const link = document.createElement('a');
    link.download = `habits-stats-${dayjs().format('YYYY-MM-DD')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('导出图片失败:', error);
    alert('导出图片失败，请重试');
  }
};

onMounted(loadData);
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  font-size: 24px;
  color: #1f2937;
}

.month-selector {
  display: flex;
  align-items: center;
  gap: 12px;
}

.month-label {
  font-weight: 600;
  color: #374151;
}

.streak-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.streak-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
}

.streak-icon {
  font-size: 32px;
}

.streak-info {
  flex: 1;
}

.streak-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.streak-count {
  color: #6b7280;
  font-size: 14px;
}

.calendar-container {
  background: #f9fafb;
  border-radius: 12px;
  padding: 16px;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.calendar-day-header {
  text-align: center;
  font-weight: 600;
  color: #6b7280;
  padding: 8px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #e5e7eb;
  opacity: 0.5;
}

.calendar-day.current-month {
  opacity: 1;
}

.calendar-day-number {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.calendar-heat {
  width: 100%;
  height: 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.heat-label {
  font-size: 12px;
  color: white;
  font-weight: 600;
}

.completion-container {
  display: grid;
  gap: 16px;
}

.completion-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.completion-header {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
}

.completion-icon {
  font-size: 24px;
}

.completion-name {
  font-weight: 600;
  color: #1f2937;
}

.completion-bar {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.completion-fill {
  height: 100%;
  transition: width 0.3s;
}

.completion-rate {
  min-width: 50px;
  text-align: right;
  font-weight: 600;
  color: #374151;
}

.export-buttons {
  display: flex;
  gap: 12px;
}
</style>
