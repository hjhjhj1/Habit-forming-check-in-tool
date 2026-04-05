<template>
  <div>
    <h2>{{ habit ? '编辑习惯' : '添加习惯' }}</h2>
    
    <div class="form-group">
      <label>习惯名称</label>
      <input v-model="form.name" class="input" placeholder="例如：每天阅读" />
    </div>
    
    <div class="form-group">
      <label>选择图标</label>
      <div class="icon-grid">
        <button v-for="icon in ICONS" :key="icon" class="icon-btn" :class="{ active: form.icon === icon }" @click="form.icon = icon">
          {{ icon }}
        </button>
      </div>
    </div>
    
    <div class="form-group">
      <label>选择颜色</label>
      <div class="color-grid">
        <button v-for="color in COLORS" :key="color" class="color-btn" :style="{ background: color }" :class="{ active: form.color === color }" @click="form.color = color"></button>
      </div>
    </div>
    
    <div class="form-group">
      <label>每日目标次数</label>
      <input v-model.number="form.dailyTarget" type="number" class="input" min="1" max="100" />
    </div>
    
    <div class="form-group">
      <label>提醒时间（可选）</label>
      <input v-model="form.reminderTime" type="time" class="input" />
    </div>
    
    <div class="form-actions">
      <button class="btn btn-secondary" @click="$emit('cancel')">取消</button>
      <button class="btn btn-primary" @click="handleSubmit" :disabled="!isValid">保存</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Habit, ICONS, COLORS } from '@/types';

const props = defineProps<{
  habit?: Habit;
}>();

const emit = defineEmits<{
  submit: [habit: Habit];
  cancel: [];
}>();

const defaultForm = {
  name: '',
  icon: '💪',
  color: '#667eea',
  dailyTarget: 1,
  reminderTime: ''
};

const form = ref(props.habit ? { ...props.habit } : defaultForm);

const isValid = computed(() => {
  return form.value.name.trim() !== '' && form.value.dailyTarget >= 1;
});

const handleSubmit = () => {
  if (isValid.value) {
    emit('submit', form.value as Habit);
  }
};
</script>

<style scoped>
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
}

.icon-btn {
  aspect-ratio: 1;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-btn:hover {
  border-color: #667eea;
}

.icon-btn.active {
  border-color: #667eea;
  background: #f0f4ff;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 8px;
}

.color-btn {
  aspect-ratio: 1;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.color-btn:hover {
  transform: scale(1.1);
}

.color-btn.active {
  border-color: #1f2937;
  transform: scale(1.1);
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}
</style>
