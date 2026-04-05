<template>
  <div class="stats-view">
    <h2>统计分析</h2>
    
    <!-- 连续打卡天数 -->
    <div class="stat-card">
      <h3>连续打卡天数</h3>
      <div class="stat-value">{{ streakDays }}</div>
      <div class="stat-description">当前连续打卡天数</div>
    </div>
    
    <!-- 周/月完成率 -->
    <div class="stat-cards">
      <div class="stat-card">
        <h3>本周完成率</h3>
        <div class="stat-value">{{ weeklyCompletionRate }}%</div>
        <div class="stat-description">本周习惯完成情况</div>
      </div>
      <div class="stat-card">
        <h3>本月完成率</h3>
        <div class="stat-value">{{ monthlyCompletionRate }}%</div>
        <div class="stat-description">本月习惯完成情况</div>
      </div>
    </div>
    
    <!-- 日历热力图 -->
    <div class="calendar-heatmap">
      <h3>打卡热力图</h3>
      <div class="heatmap-container">
        <div class="heatmap-weekdays">
          <span>日</span>
          <span>一</span>
          <span>二</span>
          <span>三</span>
          <span>四</span>
          <span>五</span>
          <span>六</span>
        </div>
        <div class="heatmap-grid">
          <div 
            v-for="day in heatmapData" 
            :key="day.date"
            class="heatmap-cell"
            :class="getHeatmapCellClass(day.count)"
            :title="`${day.date}: ${day.count}次打卡`"
          >
            <span class="heatmap-cell-date">{{ new Date(day.date).getDate() }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

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

interface Props {
  habits: Habit[];
  records: CheckIn[];
}

const props = defineProps<Props>();

// 计算连续打卡天数
const streakDays = computed(() => {
  if (props.records.length === 0) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let streak = 0;
  let currentDate = new Date(today);
  
  while (true) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const hasCheckIn = props.records.some(record => {
      const recordDate = new Date(record.timestamp);
      recordDate.setHours(0, 0, 0, 0);
      return recordDate.toISOString().split('T')[0] === dateStr;
    });
    
    if (!hasCheckIn) break;
    
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  return streak;
});

// 计算本周完成率
const weeklyCompletionRate = computed(() => {
  if (props.habits.length === 0) return 0;
  
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  let completedDays = 0;
  let totalDays = 0;
  
  props.habits.forEach(habit => {
    for (let d = new Date(startOfWeek); d <= endOfWeek; d.setDate(d.getDate() + 1)) {
      totalDays++;
      const dateStr = d.toISOString().split('T')[0];
      const dayRecords = props.records.filter(record => {
        const recordDate = new Date(record.timestamp);
        return record.habitId === habit.id && recordDate.toISOString().split('T')[0] === dateStr;
      });
      if (dayRecords.length >= habit.dailyGoal) {
        completedDays++;
      }
    }
  });
  
  return totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
});

// 计算本月完成率
const monthlyCompletionRate = computed(() => {
  if (props.habits.length === 0) return 0;
  
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  let completedDays = 0;
  let totalDays = 0;
  
  props.habits.forEach(habit => {
    for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
      totalDays++;
      const dateStr = d.toISOString().split('T')[0];
      const dayRecords = props.records.filter(record => {
        const recordDate = new Date(record.timestamp);
        return record.habitId === habit.id && recordDate.toISOString().split('T')[0] === dateStr;
      });
      if (dayRecords.length >= habit.dailyGoal) {
        completedDays++;
      }
    }
  });
  
  return totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
});

// 生成热力图数据
const heatmapData = computed(() => {
  const data = [];
  const today = new Date();
  
  // 生成过去35天的数据（5周）
  for (let i = 34; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayRecords = props.records.filter(record => {
      const recordDate = new Date(record.timestamp);
      return recordDate.toISOString().split('T')[0] === dateStr;
    });
    
    data.push({
      date: dateStr,
      count: dayRecords.length
    });
  }
  
  return data;
});

// 获取热力图单元格类名
const getHeatmapCellClass = (count: number) => {
  if (count === 0) return 'heatmap-cell-empty';
  if (count < 3) return 'heatmap-cell-low';
  if (count < 6) return 'heatmap-cell-medium';
  return 'heatmap-cell-high';
};
</script>

<style scoped>
.stats-view {
  margin-top: 30px;
}

h2 {
  color: #333;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  text-align: center;
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #4CAF50;
  margin: 10px 0;
}

.stat-description {
  color: #666;
  font-size: 14px;
}

.calendar-heatmap {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.heatmap-container {
  margin-top: 15px;
}

.heatmap-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.heatmap-weekdays span {
  text-align: center;
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.heatmap-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.heatmap-cell {
  width: 30px;
  height: 30px;
  border-radius: 4px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.heatmap-cell-date {
  font-size: 12px;
  color: #333;
  font-weight: 500;
}

.heatmap-cell-empty {
  background-color: #ebedf0;
}

.heatmap-cell-low {
  background-color: #c6e48b;
}

.heatmap-cell-medium {
  background-color: #7bc96f;
}

.heatmap-cell-high {
  background-color: #196127;
  color: white;
}

.heatmap-cell:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
