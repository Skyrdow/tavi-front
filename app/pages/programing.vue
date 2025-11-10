<script setup lang="ts">
import { ref, computed } from 'vue';

// Mocking the current date to November 2025 for demonstration
const currentMonth = ref(10); // 0-indexed: November
const currentYear = ref(2025);

const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

interface ScheduledPost {
  id: number;
  date: string; // YYYY-MM-DD
  thumbnailUrl: string;
}

const mockScheduledPosts: ScheduledPost[] = [
  { id: 1, date: "2025-11-15", thumbnailUrl: "/account.svg" },
  { id: 2, date: "2025-11-18", thumbnailUrl: "/account.svg" },
  { id: 3, date: "2025-11-25", thumbnailUrl: "/account.svg" },
];

const calendarDays = computed(() => {
  const date = new Date(currentYear.value, currentMonth.value, 1);
  const firstDayOfWeek = date.getDay(); // 0 for Sunday, 6 for Saturday
  const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate();

  const days = [];

  // Add leading empty days
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push({ day: null, dateString: null, posts: [] });
  }

  // Add actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const monthPadded = String(currentMonth.value + 1).padStart(2, '0');
    const dayPadded = String(day).padStart(2, '0');
    const dateString = `${currentYear.value}-${monthPadded}-${dayPadded}`;
    const posts = mockScheduledPosts.filter(post => post.date === dateString);
    days.push({ day, dateString, posts });
  }

  return days;
});

const monthName = computed(() => {
  return new Date(currentYear.value, currentMonth.value).toLocaleString('es-ES', { month: 'long', year: 'numeric' });
});
</script>

<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Programación de Publicaciones</h1>

    <!-- Calendar Header -->
    <div class="flex justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
      <!-- Navigation buttons are non-functional mocks for now -->
      <button class="text-2xl font-semibold text-indigo-500 hover:text-indigo-700 transition-colors">&lt;</button>
      <h2 class="text-3xl font-extrabold capitalize text-gray-900">{{ monthName }}</h2>
      <button class="text-2xl font-semibold text-indigo-500 hover:text-indigo-700 transition-colors">&gt;</button>
    </div>

    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 gap-px border border-gray-200 rounded-xl bg-gray-200 shadow-2xl overflow-hidden">
      <!-- Days of Week Headers -->
      <div
        v-for="day in daysOfWeek"
        :key="day"
        class="text-center font-bold py-3 bg-indigo-600 text-white text-sm uppercase tracking-wider"
      >
        {{ day }}
      </div>

      <!-- Days of Month -->
      <div
        v-for="(day, index) in calendarDays"
        :key="index"
        class="min-h-40 p-3 bg-white overflow-hidden transition-colors duration-150"
        :class="{ 'bg-gray-100 text-gray-400': day.day === null }"
      >
        <div v-if="day.day !== null" class="flex flex-col h-full">
          <span class="text-lg font-bold mb-2" :class="{ 'text-indigo-600': day.dateString === '2025-11-10' }">{{ day.day }}</span>
          <div class="flex-grow space-y-2 overflow-y-auto">
            <div
              v-for="post in day.posts"
              :key="post.id"
              class="w-full h-20 bg-indigo-50 rounded-lg overflow-hidden cursor-pointer border-2 border-indigo-300 hover:border-indigo-500 hover:shadow-md transition-all"
            >
              <img
                :src="post.thumbnailUrl"
                alt="Post thumbnail"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>