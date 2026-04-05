<template>
  <div class="habit-list">
    <h2>我的习惯</h2>
    <div v-if="habits.length === 0" class="empty-state">
      <p>还没有创建习惯，点击下方按钮创建第一个习惯吧！</p>
    </div>
    <div v-else class="habits-grid">
      <div v-for="habit in habits" :key="habit.id" class="habit-card" :style="{ borderLeftColor: habit.color }">
        <div class="habit-header">
          <div class="habit-icon">{{ habit.icon }}</div>
          <div class="habit-info">
            <h3>{{ habit.name }}</h3>
            <div class="habit-meta">
              <span class="habit-goal">每日目标: <strong>{{ habit.dailyGoal }}次</strong></span>
              <span v-if="habit.reminderTime" class="habit-reminder">提醒时间: {{ habit.reminderTime }}</span>
            </div>
          </div>
          <div class="habit-actions">
            <button class="btn btn-sm btn-edit" @click="editHabit(habit)">编辑</button>
            <button class="btn btn-sm btn-delete" @click="deleteHabit(habit.id)">删除</button>
          </div>
        </div>
        <!-- 打卡表单 -->
        <div class="check-in-section">
          <h4>今日打卡</h4>
          <CheckInForm
            :habit="habit"
            @checkIn="handleCheckIn"
          />
        </div>
        <!-- 打卡记录 -->
        <CheckInList
          :records="records"
          :habitId="habit.id"
          @delete="handleDeleteRecord"
        />
      </div>
    </div>
    <button class="btn btn-primary btn-add" @click="addHabit">+ 创建习惯</button>
  </div>
</template>

<script setup lang="ts">
import CheckInForm from './CheckInForm.vue';
import CheckInList from './CheckInList.vue';

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

const emit = defineEmits<{
  (e: 'add'): void;
  (e: 'edit', habit: Habit): void;
  (e: 'delete', habitId: string): void;
  (e: 'checkIn', habitId: string, note?: string): void;
  (e: 'deleteRecord', recordId: string): void;
}>();

const addHabit = () => {
  emit('add');
};

const editHabit = (habit: Habit) => {
  emit('edit', habit);
};

const deleteHabit = (habitId: string) => {
  if (confirm('确定要删除这个习惯吗？')) {
    emit('delete', habitId);
  }
};

const handleCheckIn = (habitId: string, note?: string) => {
  emit('checkIn', habitId, note);
};

const handleDeleteRecord = (recordId: string) => {
  emit('deleteRecord', recordId);
};
</script>

<style scoped>
.habit-list {
  margin-bottom: 30px;
}

h2 {
  color: #333;
  margin-bottom: 20px;
}

.empty-state {
  background: #f9f9f9;
  padding: 40px;
  text-align: center;
  border-radius: 8px;
  color: #666;
}

.habits-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.habit-card {
  flex: 1 1 250px;
  min-width: 250px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #4CAF50;
  transition: transform 0.2s;
  box-sizing: border-box;
}

/* 响应式布局调整 */
@media (min-width: 600px) {
  .habit-card {
    flex: 1 1 280px;
    min-width: 280px;
  }
}

@media (min-width: 768px) {
  .habit-card {
    flex: 1 1 300px;
    min-width: 300px;
  }
}

@media (min-width: 1024px) {
  .habit-card {
    flex: 1 1 320px;
    min-width: 320px;
  }
}

@media (min-width: 1200px) {
  .habit-card {
    flex: 1 1 350px;
    min-width: 350px;
  }
}

.habit-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.habit-header {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.habit-icon {
  font-size: 32px;
  margin-top: 2px;
}

.habit-info {
  flex: 1;
}

.habit-info h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 18px;
}

.habit-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.habit-goal {
  color: #666;
  font-size: 14px;
  background: #f9f9f9;
  padding: 4px 8px;
  border-radius: 12px;
}

.habit-goal strong {
  color: #4CAF50;
}

.habit-reminder {
  color: #666;
  font-size: 14px;
  background: #f0f8ff;
  padding: 4px 8px;
  border-radius: 12px;
}

.check-in-section {
  margin-bottom: 20px;
}

.check-in-section h4 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 16px;
}

.habit-actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
}

.btn-edit {
  background-color: #2196F3;
  color: white;
}

.btn-edit:hover {
  background-color: #1976D2;
}

.btn-delete {
  background-color: #f44336;
  color: white;
}

.btn-delete:hover {
  background-color: #d32f2f;
}

.btn-add {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  margin-top: 10px;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background-color: #45a049;
}
</style>
