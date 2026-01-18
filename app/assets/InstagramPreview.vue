<script setup lang="ts">
import { computed } from "vue";

interface Props {
  mediaFile: File | null;
  description: string;
}

const props = defineProps<Props>();

const mediaUrl = computed(() => {
  if (props.mediaFile) {
    return URL.createObjectURL(props.mediaFile);
  }
  return null;
});
</script>

<template>
  <div
    class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden max-w-md mx-auto"
  >
    <!-- Header (simulando Instagram) -->
    <div class="flex items-center p-4 border-b border-gray-200">
      <div
        class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3"
      >
        <svg
          class="w-4 h-4 text-gray-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <div>
        <p class="font-semibold text-sm">Tu Perfil</p>
        <p class="text-xs text-gray-500">Ahora</p>
      </div>
      <div class="ml-auto">
        <svg
          class="w-5 h-5 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
          />
        </svg>
      </div>
    </div>

    <!-- Media -->
    <div v-if="mediaUrl" class="aspect-square bg-gray-200">
      <img
        :src="mediaUrl"
        alt="Post media"
        class="object-cover w-full h-full"
      />
    </div>
    <div
      v-else
      class="aspect-square bg-gray-200 flex items-center justify-center"
    >
      <p class="text-gray-500">Sin imagen</p>
    </div>

    <!-- Actions (simulando Instagram) -->
    <div class="p-4">
      <div class="flex items-center space-x-4 mb-3">
        <svg
          class="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <svg
          class="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <svg
          class="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
        <svg
          class="w-6 h-6 text-gray-700 ml-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      </div>

      <!-- Likes -->
      <p class="text-sm font-semibold mb-2">0 likes</p>

      <!-- Caption -->
      <div v-if="description" class="text-sm">
        <span class="font-semibold">Tu Perfil</span>
        <span class="ml-2 whitespace-pre-line">{{ description }}</span>
      </div>
      <div v-else class="text-sm text-gray-500 italic">Sin descripción</div>

      <!-- Comments placeholder -->
      <p class="text-xs text-gray-400 mt-2">Ver comentarios</p>
    </div>
  </div>
</template>
