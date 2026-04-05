<template>
  <div class="check-in-list">
    <h3>今日打卡记录</h3>
    <div v-if="todayRecords.length === 0" class="empty-state">
      <p>今天还没有打卡记录</p>
    </div>
    <div v-else class="records">
      <div v-for="record in todayRecords" :key="record.id" class="record-item">
        <div class="record-info">
          <span class="record-time">{{ formatTime(record.timestamp) }}</span>
          <span v-if="record.note" class="record-note">{{ record.note }}</span>
        </div>
        <button class="btn btn-sm btn-delete" @click="deleteRecord(record.id)">
          删除
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface CheckIn {
  id: string;
  habitId: string;
  timestamp: number;
  note?: string;
}

interface Props {
  records: CheckIn[];
  habitId: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'delete', recordId: string): void;
}>();

// 计算今天的打卡记录
const todayRecords = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime();
  
  return props.records
    .filter(record => record.habitId === props.habitId)
    .filter(record => {
      const recordDate = new Date(record.timestamp);
      recordDate.setHours(0, 0, 0, 0);
      return recordDate.getTime() === todayTimestamp;
    })
    .sort((a, b) => b.timestamp - a.timestamp);
});

// 格式化时间
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
};

// 删除打卡记录
const deleteRecord = (recordId: string) => {
  if (confirm('确定要删除这条打卡记录吗？')) {
    emit('delete', recordId);
  }
};
</script>

<style scoped>
.check-in-list {
  margin-top: 20px;
}

h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 16px;
}

.empty-state {
  background: #f9f9f9;
  padding: 20px;
  text-align: center;
  border-radius: 8px;
  color: #666;
  font-size: 14px;
}

.records {
  border-top: 1px solid #e0e0e0;
  padding-top: 10px;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.record-item:last-child {
  border-bottom: none;
}

.record-info {
  flex: 1;
}

.record-time {
  font-size: 14px;
  color: #666;
  margin-right: 10px;
}

.record-note {
  font-size: 14px;
  color: #333;
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 12px;
}

.btn {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.btn-delete {
  background-color: #f44336;
  color: white;
}

.btn-delete:hover {
  background-color: #d32f2f;
}
</style>
