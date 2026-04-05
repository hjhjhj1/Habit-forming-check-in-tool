<template>
  <div class="check-in-form">
    <h3>{{ habit?.name }} - 打卡</h3>
    <form @submit.prevent="handleCheckIn">
      <div class="form-group">
        <label for="note">备注（可选）</label>
        <textarea id="note" v-model="form.note" rows="3" placeholder="添加打卡备注..."></textarea>
      </div>
      <button type="submit" class="btn btn-primary" :disabled="loading">
        {{ loading ? '打卡中...' : '打卡' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  dailyGoal: number;
  reminderTime?: string;
}

interface Props {
  habit: Habit;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'checkIn', habitId: string, note?: string): void;
}>();

const loading = ref(false);
const form = ref({
  note: ''
});

const handleCheckIn = () => {
  emit('checkIn', props.habit.id, form.value.note);
  form.value.note = '';
};
</script>

<style scoped>
.check-in-form {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  margin-top: 10px;
}

h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #555;
}

textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background-color: #45a049;
}

.btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
