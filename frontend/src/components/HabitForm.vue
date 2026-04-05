<template>
  <div class="habit-form">
    <h2>{{ isEditing ? '编辑习惯' : '创建习惯' }}</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">习惯名称</label>
        <input type="text" id="name" v-model="form.name" required>
      </div>
      <div class="form-group">
        <label for="icon">图标</label>
        <select id="icon" v-model="form.icon" required>
          <option value="📚">📚 阅读</option>
          <option value="🏃">🏃 运动</option>
          <option value="💧">💧 喝水</option>
          <option value="💤">💤 睡眠</option>
          <option value="🎨">🎨 创作</option>
          <option value="📝">📝 写作</option>
          <option value="🧘">🧘 冥想</option>
          <option value="🍎">🍎 健康饮食</option>
        </select>
      </div>
      <div class="form-group">
        <label for="color">颜色</label>
        <input type="color" id="color" v-model="form.color" required>
      </div>
      <div class="form-group">
        <label for="dailyGoal">每日目标次数</label>
        <input type="number" id="dailyGoal" v-model.number="form.dailyGoal" min="1" required>
      </div>
      <div class="form-group">
        <label for="reminderTime">提醒时间</label>
        <input type="time" id="reminderTime" v-model="form.reminderTime">
      </div>
      <div class="form-actions">
        <button type="submit" class="btn btn-primary">{{ isEditing ? '更新' : '创建' }}</button>
        <button type="button" class="btn btn-secondary" @click="cancel">取消</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  dailyGoal: number;
  reminderTime?: string;
}

interface Props {
  habit?: Habit;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'submit', habit: Omit<Habit, 'id'>): void;
  (e: 'cancel'): void;
}>();

const isEditing = computed(() => !!props.habit);

const form = ref({
  name: '',
  icon: '📚',
  color: '#4CAF50',
  dailyGoal: 1,
  reminderTime: ''
});

watch(() => props.habit, (newHabit) => {
  if (newHabit) {
    form.value = {
      name: newHabit.name,
      icon: newHabit.icon,
      color: newHabit.color,
      dailyGoal: newHabit.dailyGoal,
      reminderTime: newHabit.reminderTime || ''
    };
  }
}, { immediate: true });

const handleSubmit = () => {
  emit('submit', form.value);
};

const cancel = () => {
  emit('cancel');
};
</script>

<style scoped>
.habit-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

h2 {
  margin-top: 0;
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

input,
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
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
  background-color: #f1f1f1;
  color: #333;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}
</style>
