<script setup lang="ts">
import { ref, computed } from "vue";
import Chat from "~/assets/Chat.vue";
import MediaUploader from "~/assets/MediaUploader.vue";

// Mock data for the scheduled post
const mediaFile = ref<File | null>(null);
const scheduledDate = ref<Date | null>(new Date(Date.now() + 86400000)); // Mock: Tomorrow

const handleFileUploaded = (file: File | null) => {
  mediaFile.value = file;
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

// Mock image URL for preview
const mediaUrl = computed(() => {
  if (mediaFile.value) {
    return URL.createObjectURL(mediaFile.value);
  }
  // Placeholder for when no file is uploaded
  return null;
});
</script>

<template>
  <div
    class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 bg-gray-50 min-h-screen"
  >
    <!-- Left Column: Controls (Uploader, Chat, Scheduling) -->
    <div class="flex flex-col gap-6">
      <MediaUploader @file-uploaded="handleFileUploaded" />

      <!-- Scheduled Date Card -->
      <div class="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
        <h3
          class="font-bold text-xl mb-3 text-gray-800 flex items-center gap-2"
        >
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
        <p
          class="text-2xl font-mono text-indigo-600 bg-indigo-50 p-3 rounded-lg"
        >
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
      <Chat class="grow" />
    </div>

    <!-- Right Column: Post Preview -->
    <div class="flex justify-center">
      <div
        class="w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
      >
        <!-- Header -->
        <span class="flex items-center gap-3 p-4">
          <img
            class="size-10 rounded-full"
            src="/assets/account.svg"
            alt="Profile Picture"
          />
          <p class="font-semibold text-gray-800">nombre.negocio</p>
        </span>

        <!-- Media Preview -->
        <div
          class="aspect-square w-full bg-gray-200 flex items-center justify-center"
        >
          <img
            v-if="mediaUrl"
            :src="mediaUrl"
            alt="Post media preview"
            class="object-cover w-full h-full"
          />
          <p v-else class="text-gray-500 font-medium">
            Sube una imagen o video para previsualizar
          </p>
        </div>

        <!-- Actions -->
        <div class="flex justify-between w-full p-3">
          <span class="inline-flex gap-2">
            <img
              class="size-8 cursor-pointer hover:opacity-75 transition-opacity"
              src="/assets/like.svg"
              alt="Like"
            />
            <img
              class="size-8 cursor-pointer hover:opacity-75 transition-opacity"
              src="/assets/comment.svg"
              alt="Comment"
            />
            <img
              class="size-8 cursor-pointer hover:opacity-75 transition-opacity"
              src="/assets/send.svg"
              alt="Send"
            />
          </span>
          <img
            class="size-8 cursor-pointer hover:opacity-75 transition-opacity"
            src="/assets/save.svg"
            alt="Save"
          />
        </div>

        <!-- Caption -->
        <p class="px-4 pb-4 text-gray-700">
          <b class="text-gray-900">nombre.negocio</b> descripcion IA: Lorem
          ipsum dolor sit amet, consectetur adipiscing elit. Ut semper metus in
          mi efficitur, in rutrum sapien luctus. Vestibulum egestas felis
          venenatis gravida blandit. Nullam fermentum gravida auctor. Etiam
          pretium egestas elit, congue mollis lacus iaculis id. Aenean vulputate
          blandit egestas. Maecenas pharetra porta tristique. Sed enim tellus,
          euismod eu nisi at, ultricies fringilla eros. Praesent mi leo,
          vehicula volutpat est id, elementum cursus magna. Etiam at porttitor
          tortor, sed tincidunt dolor.
        </p>
      </div>
    </div>
  </div>
</template>
