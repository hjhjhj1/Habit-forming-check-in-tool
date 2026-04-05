<template>
  <div class="app">
    <header class="app-header">
      <h1>习惯养成打卡工具</h1>
    </header>
    <main class="app-main">
      <!-- 习惯列表 -->
      <HabitList
        :habits="habits"
        :records="records"
        @add="showAddForm"
        @edit="showEditForm"
        @delete="handleDeleteHabit"
        @checkIn="handleCheckIn"
        @deleteRecord="handleDeleteRecord"
      />
      
      <!-- 统计视图 -->
      <StatsView
        :habits="habits"
        :records="records"
      />
      
      <!-- 数据导出 -->
      <ExportTool
        :habits="habits"
        :records="records"
      />
    </main>
    
    <!-- 习惯表单模态框 -->
    <div v-if="showForm" class="modal-overlay" @click="showForm = false">
      <div class="modal-content" @click.stop>
        <HabitForm
          :habit="editingHabit"
          @submit="handleFormSubmit"
          @cancel="showForm = false"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useHabitStore } from './stores/habitStore';
import HabitForm from './components/HabitForm.vue';
import HabitList from './components/HabitList.vue';
import StatsView from './components/StatsView.vue';
import ExportTool from './components/ExportTool.vue';

interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  dailyGoal: number;
  reminderTime?: string;
}

const habitStore = useHabitStore();
const showForm = ref(false);
const editingHabit = ref<Habit | undefined>();

// 加载习惯列表和打卡记录
onMounted(async () => {
  await habitStore.loadHabits();
  const currentMonth = new Date().toISOString().slice(0, 7);
  await habitStore.loadRecords(currentMonth);
});

// 显示添加习惯表单
const showAddForm = () => {
  editingHabit.value = undefined;
  showForm.value = true;
};

// 显示编辑习惯表单
const showEditForm = (habit: Habit) => {
  editingHabit.value = habit;
  showForm.value = true;
};

// 处理表单提交
const handleFormSubmit = async (habitData: Omit<Habit, 'id'>) => {
  if (editingHabit.value) {
    // 更新习惯
    await habitStore.updateHabit(editingHabit.value.id, habitData);
  } else {
    // 创建新习惯
    await habitStore.createHabit(habitData);
  }
  showForm.value = false;
};

// 处理删除习惯
const handleDeleteHabit = async (habitId: string) => {
  await habitStore.deleteHabit(habitId);
};

// 处理打卡
const handleCheckIn = async (habitId: string, note?: string) => {
  await habitStore.checkIn(habitId, note);
};

// 处理删除打卡记录
const handleDeleteRecord = async (recordId: string) => {
  await habitStore.deleteCheckIn(recordId);
};

// 计算属性：获取习惯列表
const habits = computed(() => habitStore.habits);

// 计算属性：获取打卡记录
const records = computed(() => habitStore.records);
</script>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.app-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px 0;
  border-bottom: 1px solid #e0e0e0;
}

.app-header h1 {
  color: #333;
  font-size: 28px;
}

.app-main {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
