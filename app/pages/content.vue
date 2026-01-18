<script setup lang="ts">
import { ref, computed } from "vue";
import InstagramPreview from "~/assets/InstagramPreview.vue";
import MediaUploader from "~/assets/MediaUploader.vue";
import Chat from "~/assets/Chat.vue";
import { Calendar, DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import { useApi } from "~/composables/useApi";
import { useAuth } from "~/composables/useAuth";

definePageMeta({
  middleware: "auth",
});

const contentStore = useContentStore();
const { scheduleJob } = useApi();
const { token } = useAuth();

const disabledDates = ref([{ end: new Date(Date.now() - 24 * 60 * 60 * 1000), start: null }]);
const selectedDate = ref(new Date());

// Estado para la descripción
const description = computed({
  get: () => contentStore.description,
  set: (value) => contentStore.description = value,
});
const mediaFile = computed(() => contentStore.mediaFile);

// Estado para la fecha agendada
const scheduledDate = computed({
  get: () => contentStore.scheduledDate,
  set: (value) => contentStore.scheduledDate = value,
});
const isScheduling = ref(false);
// const selectedDate = ref("");

const handleFileUploaded = (file: File | null) => {
  contentStore.setMediaFile(file);
};

const handleDescriptionUpdate = (newDescription: string) => {
  description.value = newDescription;
};

const publishNow = () => {
  if (!mediaFile.value) {
    alert("Por favor, sube un archivo multimedia antes de publicar.");
    return;
  }
  // Simular publicación inmediata
  alert("¡Publicación realizada exitosamente!");
  // Aquí iría la lógica real para publicar
};

const startScheduling = () => {
  isScheduling.value = true;
};

const confirmSchedule = async () => {
  if (selectedDate.value && token.value) {
    try {
      const data = {
        description: description.value,
        media: contentStore.mediaFileData,
      };
      const scheduledAt = selectedDate.value.toISOString();
      await scheduleJob(token.value, "publishPost", data, scheduledAt);
      scheduledDate.value = new Date(selectedDate.value);
      isScheduling.value = false;
      selectedDate.value = new Date();
      alert("Publicación programada para: " + formattedDate.value);
    } catch (e) {
      alert("Error al programar la publicación");
    }
  }
};

const cancelSchedule = () => {
  isScheduling.value = false;
  selectedDate.value = new Date();
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
    <h1>Publicación de contenido</h1>

    <!-- Layout de dos columnas -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Columna izquierda: Controles -->
      <div class="space-y-6">
        <!-- Subida de multimedia -->
        <div>
          <h2 class="text-lg font-semibold mb-4">Subir contenido multimedia</h2>
          <MediaUploader @file-uploaded="handleFileUploaded" />
        </div>

        <!-- Descripción -->
        <div>
          <h2 class="text-lg font-semibold mb-4">
            Descripción de la publicación
          </h2>
          <textarea
            v-model="description"
            placeholder="Escribe la descripción de tu publicación..."
            class="w-full p-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            rows="6"
          />
        </div>

        <!-- Chat con LLM para modificaciones -->
        <div>
          <h2 class="text-lg font-semibold mb-4">
            Asistente IA para modificar descripción
          </h2>
          <Chat
            @file-uploaded="handleFileUploaded"
            @description-update="handleDescriptionUpdate"
            :current-description="description"
          />
        </div>
      </div>

      <!-- Columna derecha: Vista previa -->
      <div class="space-y-6">
        <h2 class="text-lg font-semibold">Vista previa de la publicación</h2>
        <InstagramPreview :media-file="mediaFile" :description="description" />
      </div>
    </div>

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

    <!-- Botones de acción -->
    <div class="flex flex-col items-center gap-4">
      <div class="flex gap-4">
        <button
          @click="publishNow"
          class="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Publicar Ahora
        </button>
        <button
          @click="startScheduling"
          class="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
        >
          Programar Publicación
        </button>
      </div>

      <!-- Modal Date picker para programar -->
      <div
        v-if="isScheduling"
        class="fixed inset-0 bg-white bg-opacity-20 flex items-center justify-center z-50"
        @click="cancelSchedule"
      >
        <div
          class="bg-white p-6 rounded-xl shadow-lg border border-gray-100 max-w-md w-full mx-4 relative"
          @click.stop
        >
          <button
            @click="cancelSchedule"
            class="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h3 class="font-bold text-lg mb-4 text-gray-800 pr-8">
            Seleccionar fecha de publicación
          </h3>
          <!-- <input
            type="date"
            v-model="selectedDate"
            :min="new Date(Date.now() + 86400000).toISOString().split('T')[0]"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          /> -->

          <div class="flex items-center justify-center">
            <DatePicker :disabled-dates="disabledDates" v-model="selectedDate" mode="dateTime" is24hr/>
          </div>

          <div class="flex gap-2 mt-4">
            <button
              @click="confirmSchedule"
              :disabled="!selectedDate"
              class="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
            >
              Confirmar
            </button>
            <button
              @click="cancelSchedule"
              class="flex-1 px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
