<template>
  <div class="export-tool">
    <h2>数据导出</h2>
    <div class="export-options">
      <button class="btn btn-primary" @click="exportAsJson">导出为 JSON</button>
      <button class="btn btn-secondary" @click="exportAsImage">导出为图片</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import html2canvas from 'html2canvas';

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

// 导出为 JSON
const exportAsJson = () => {
  const data = {
    habits: props.habits,
    records: props.records,
    exportDate: new Date().toISOString()
  };
  
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `habit-tracker-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// 导出为图片
const exportAsImage = async () => {
  try {
    const statsElement = document.querySelector('.stats-view');
    if (statsElement) {
      const canvas = await html2canvas(statsElement);
      const image = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = image;
      a.download = `habit-stats-${new Date().toISOString().split('T')[0]}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert('未找到统计视图元素');
    }
  } catch (error) {
    console.error('导出图片失败:', error);
    alert('导出图片失败，请稍后重试');
  }
};
</script>

<style scoped>
.export-tool {
  margin-top: 30px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #333;
  margin-bottom: 20px;
}

.export-options {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background-color: #45a049;
}

.btn-secondary {
  background-color: #2196F3;
  color: white;
}

.btn-secondary:hover {
  background-color: #1976D2;
}
</style>
