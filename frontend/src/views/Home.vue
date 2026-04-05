<template>
  <div>
    <div class="card">
      <div class="header">
        <h1>我的习惯</h1>
        <button class="btn btn-primary" @click="showAddModal = true">+ 添加习惯</button>
      </div>
    </div>

    <div class="habits-grid">
      <div v-for="habit in habits" :key="habit.id" class="card habit-card" :style="{ borderLeftColor: habit.color }">
        <div class="habit-header">
          <div class="habit-info">
            <span class="habit-icon">{{ habit.icon }}</span>
            <div>
              <h3>{{ habit.name }}</h3>
              <p class="habit-target">每日目标: {{ habit.dailyTarget }} 次</p>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" @click="editHabit(habit)">编辑</button>
        </div>
        
        <div class="checkin-section">
          <div class="today-stats">
            <span>今日已打卡: {{ getTodayCheckIns(habit.id) }} / {{ habit.dailyTarget }}</span>
          </div>
          <div class="checkin-buttons">
            <button class="btn btn-primary" @click="handleCheckIn(habit)">
              ✅ 打卡
            </button>
            <button class="btn btn-secondary" @click="openNoteModal(habit)">
              📝 打卡并备注
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="habits.length === 0" class="card empty-state">
      <div class="empty-icon">🎯</div>
      <p>还没有添加任何习惯，点击上方按钮开始添加吧！</p>
    </div>

    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal">
        <HabitForm @submit="addHabit" @cancel="showAddModal = false" />
      </div>
    </div>

    <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
      <div class="modal">
        <HabitForm :habit="editingHabit" @submit="saveHabit" @cancel="showEditModal = false" />
      </div>
    </div>

    <div v-if="showNoteModal" class="modal-overlay" @click.self="showNoteModal = false">
      <div class="modal note-modal">
        <h2>打卡备注</h2>
        <textarea v-model="noteText" placeholder="写下今天的感受..."></textarea>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="showNoteModal = false">取消</button>
          <button class="btn btn-primary" @click="confirmCheckIn">确认打卡</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import dayjs from 'dayjs';
import { getHabits, createHabit, updateHabit, deleteHabit, checkIn, getRecords } from '@/api';
import { Habit, CheckInRecord } from '@/types';
import HabitForm from '@/components/HabitForm.vue';

const habits = ref<Habit[]>([]);
const records = ref<CheckInRecord[]>([]);
const showAddModal = ref(false);
const showEditModal = ref(false);
const showNoteModal = ref(false);
const editingHabit = ref<Habit | null>(null);
const currentHabit = ref<Habit | null>(null);
const noteText = ref('');

const today = dayjs().format('YYYY-MM-DD');
const currentMonth = dayjs().format('YYYY-MM');

const loadData = async () => {
  const [habitsData, recordsData] = await Promise.all([
    getHabits(),
    getRecords(currentMonth)
  ]);
  habits.value = habitsData;
  records.value = recordsData;
};

const getTodayCheckIns = (habitId: string) => {
  return records.value.filter(r => r.habitId === habitId && r.date === today).length;
};

const addHabit = async (habit: Omit<Habit, 'id' | 'createdAt' | 'isActive'>) => {
  const newHabit = await createHabit(habit);
  habits.value.push(newHabit);
  showAddModal.value = false;
};

const editHabit = (habit: Habit) => {
  editingHabit.value = { ...habit };
  showEditModal.value = true;
};

const saveHabit = async (habit: Habit) => {
  await updateHabit(habit.id, habit);
  const index = habits.value.findIndex(h => h.id === habit.id);
  if (index !== -1) {
    habits.value[index] = habit;
  }
  showEditModal.value = false;
};

const handleCheckIn = async (habit: Habit) => {
  await checkIn(habit.id, today);
  records.value = await getRecords(currentMonth);
};

const openNoteModal = (habit: Habit) => {
  currentHabit.value = habit;
  noteText.value = '';
  showNoteModal.value = true;
};

const confirmCheckIn = async () => {
  if (currentHabit.value) {
    await checkIn(currentHabit.value.id, today, noteText.value);
    records.value = await getRecords(currentMonth);
    showNoteModal.value = false;
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

.habits-grid {
  display: grid;
  gap: 16px;
}

.habit-card {
  border-left: 4px solid;
}

.habit-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.habit-info {
  display: flex;
  gap: 12px;
  align-items: center;
}

.habit-icon {
  font-size: 32px;
}

.habit-info h3 {
  font-size: 18px;
  color: #1f2937;
  margin-bottom: 4px;
}

.habit-target {
  color: #6b7280;
  font-size: 14px;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 12px;
}

.checkin-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 16px;
}

.today-stats {
  margin-bottom: 12px;
  font-weight: 600;
  color: #374151;
}

.checkin-buttons {
  display: flex;
  gap: 12px;
}

.empty-state {
  text-align: center;
  padding: 48px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state p {
  color: #6b7280;
  font-size: 16px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.note-modal {
  max-width: 400px;
}

.modal h2 {
  margin-bottom: 20px;
  color: #1f2937;
}

.modal textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  min-height: 100px;
  margin-bottom: 20px;
}

.modal textarea:focus {
  outline: none;
  border-color: #667eea;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
</style>
