<script setup lang="ts">
import { ref, computed } from "vue";
import Chat from "~/assets/Chat.vue";

definePageMeta({
  middleware: "auth",
});

// Mock data for the scheduled post
const scheduledDate = ref<Date | null>(new Date(Date.now() + 86400000)); // Mock: Tomorrow

const handleFileUploaded = (file: File | null) => {
  // File handled in Chat component
};

const formattedDate = computed(() => {
  if (!scheduledDate.value) return "No agendada";
  return scheduledDate.value.toLocaleString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
});
</script>

<template>
  <div class="flex flex-col gap-6 p-8 bg-gray-50 min-h-screen">
    <!-- Scheduled Date Card -->
    <div
      class="p-6 bg-white rounded-xl shadow-lg border border-gray-100 max-w-md mx-auto"
    >
      <h3 class="font-bold text-xl mb-3 text-gray-800 flex items-center gap-2">
        <svg
          class="w-6 h-6 text-indigo-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        Publicación Agendada
      </h3>
      <p class="text-2xl font-mono text-indigo-600 bg-indigo-50 p-3 rounded-lg">
        {{ formattedDate }}
      </p>
      <!-- Placeholder for scheduling control (e.g., a date picker) -->
      <button
        class="mt-4 text-sm font-semibold text-indigo-500 hover:text-indigo-700 transition-colors"
      >
        Cambiar fecha y hora
      </button>
    </div>

    <!-- AI Chat Component -->
    <Chat class="grow" @file-uploaded="handleFileUploaded" />
  </div>
</template>
