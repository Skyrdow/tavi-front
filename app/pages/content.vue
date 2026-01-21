<script setup lang="ts">
import { ref, computed } from "vue";
import InstagramPreview from "~/assets/InstagramPreview.vue";
import MediaUploader from "~/assets/MediaUploader.vue";
import Chat from "~/assets/Chat.vue";
import { Calendar, DatePicker } from "v-calendar";
import "v-calendar/style.css";
import { useApi } from "~/composables/useApi";
import { useAuth } from "~/composables/useAuth";
import { useContentStore } from "~/stores/content";

definePageMeta({
  middleware: "auth",
});

const contentStore = useContentStore();
const { createPost, scheduleJob, generateDescription } = useApi();
const { token, tenantId } = useAuth();

const disabledDates = ref([
  { end: new Date(Date.now() - 24 * 60 * 60 * 1000), start: null },
]);
const selectedDate = ref(new Date());

// Estado para la descripción
const description = computed({
  get: () => contentStore.description,
  set: (value) => (contentStore.description = value.substring(0, 2200)),
});
const mediaUrl = computed({
  get: () => contentStore.mediaUrl,
  set: (value) => contentStore.setMediaUrl(value),
});

// Estado para la fecha agendada
const scheduledDate = computed({
  get: () => contentStore.scheduledDate,
  set: (value) => (contentStore.scheduledDate = value),
});
const isScheduling = ref(false);
const isProcessing = ref(false);
// const selectedDate = ref("");

const handleUrlChanged = (url: string | null) => {
  contentStore.setMediaUrl(url);
};

const handleDescriptionUpdate = (newDescription: string) => {
  description.value = newDescription;
};

const generateAIDescription = async () => {
  if (!contentStore.mediaUrl || !tenantId.value) {
    alert(
      "Por favor, ingresa una URL de imagen y asegúrate de estar autenticado.",
    );
    return;
  }
  try {
    const response = await generateDescription(
      tenantId.value,
      contentStore.mediaUrl,
    );
    if (response.success) {
      description.value = response.data;
    } else {
      alert("Error generando descripción: " + response.message);
    }
  } catch (e) {
    console.error("Error:", e);
    alert("Error de conexión al generar descripción.");
  }
};

const publishNow = async () => {
  if (isProcessing.value) return;
  if (!mediaUrl.value) {
    alert("Por favor, ingresa una URL de imagen antes de publicar.");
    return;
  }
  if (!description.value.trim()) {
    alert("Por favor, ingresa una descripción antes de publicar.");
    return;
  }
  if (!token.value) {
    alert("Token de autenticación no encontrado.");
    return;
  }

  isProcessing.value = true;
  try {
    // 1. Crear el post
    const postData = {
      title:"Title "+Date.now(),
      content: description.value.trim(),
      imageURL: mediaUrl.value,
    };

    const postResponse = await createPost(token.value, postData);

    if (!postResponse?.success || !postResponse?.data?.id) {
      alert(
        "Error al crear el post: " +
          (postResponse?.message || "Error desconocido"),
      );
      return;
    }

    // 2. Publicar inmediatamente (sin job)
    // Aquí iría la lógica de publicar directamente, pero como no tenemos endpoint, por ahora usar job inmediato y asumir se ejecuta
    const scheduledAt = new Date().toISOString();

    const jobResponse = await scheduleJob(
      token.value,
      "publishPost",
      { postId: postResponse.data.id },
      scheduledAt,
    );

    if (jobResponse?.success) {
      alert("¡Publicación realizada exitosamente!");
      // Limpiar los campos después de publicar
      description.value = "";
      contentStore.setMediaUrl(null);
    } else {
      alert(
        "Error al programar la publicación: " +
          (jobResponse?.message || "Error desconocido"),
      );
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error de conexión al publicar");
  } finally {
    isProcessing.value = false;
  }
};

const startScheduling = () => {
  isScheduling.value = true;
};

const confirmSchedule = async () => {
  if (isProcessing.value) return;
  if (!selectedDate.value) {
    alert("Por favor, selecciona una fecha y hora.");
    return;
  }
  if (!description.value.trim()) {
    alert("Por favor, ingresa una descripción antes de programar.");
    return;
  }
  if (!mediaUrl.value) {
    alert("Por favor, ingresa una URL de imagen antes de programar.");
    return;
  }
  if (!token.value) {
    alert("Token de autenticación no encontrado.");
    return;
  }

  isProcessing.value = true;
  try {
    // 1. Crear el post
    const postData = {
      title:"Title "+Date.now(),
      content: description.value.trim(),
      imageURL: mediaUrl.value,
    };

    const postResponse = await createPost(token.value, postData);

    if (!postResponse?.success || !postResponse?.data?.id) {
      alert(
        "Error al crear el post: " +
          (postResponse?.message || "Error desconocido"),
      );
      return;
    }

    // 2. Programar el job para la fecha seleccionada
    const scheduledAt = selectedDate.value.toISOString();

    const jobResponse = await scheduleJob(
      token.value,
      "publishPost",
      { postId: postResponse.data.id },
      scheduledAt,
    );

    if (jobResponse?.success) {
      scheduledDate.value = new Date(selectedDate.value);
      isScheduling.value = false;
      selectedDate.value = new Date();
      alert("Publicación programada para: " + formattedDate.value);
      // Limpiar los campos después de programar
      description.value = "";
      contentStore.setMediaUrl(null);
    } else {
      alert(
        "Error al programar la publicación: " +
          (jobResponse?.message || "Error desconocido"),
      );
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error de conexión al programar publicación");
  } finally {
    isProcessing.value = false;
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
        <!-- URL de multimedia -->
        <div>
          <h2 class="text-lg font-semibold mb-4">URL de la imagen</h2>
          <MediaUploader v-model="mediaUrl" />
        </div>

        <!-- Descripción -->
        <div>
          <h2 class="text-lg font-semibold mb-4">
            Descripción de la publicación
          </h2>
          <button
            @click="generateAIDescription"
            class="mb-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Generar descripción con IA
          </button>
          <textarea
            v-model="description"
            placeholder="Escribe la descripción de tu publicación..."
            class="w-full p-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            rows="6"
            maxlength="2200"
          />
          <p
            class="text-sm mt-2"
            :class="description.length > 2000 ? 'text-red-600' : 'text-gray-600'"
          >
            {{ description.length }}/2200 caracteres
          </p>
        </div>

        <!-- Chat con LLM para modificaciones -->
        <div>
          <h2 class="text-lg font-semibold mb-4">
            Asistente IA para modificar descripción
          </h2>
          <Chat
            @description-update="handleDescriptionUpdate"
            :current-description="description"
          />
        </div>
      </div>

      <!-- Columna derecha: Vista previa -->
      <div class="space-y-6">
        <h2 class="text-lg font-semibold">Vista previa de la publicación</h2>
        <InstagramPreview :media-url="mediaUrl" :description="description" />
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
          :disabled="isProcessing"
          class="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
        >
          Publicar Ahora
        </button>
        <button
          @click="startScheduling"
          :disabled="isProcessing"
          class="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-400"
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
            <DatePicker
              :disabled-dates="disabledDates"
              v-model="selectedDate"
              mode="dateTime"
              is24hr
            />
          </div>

          <div class="flex gap-2 mt-4">
            <button
              @click="confirmSchedule"
              :disabled="!selectedDate || isProcessing"
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
