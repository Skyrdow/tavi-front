<script setup lang="ts">
import { ref, computed } from "vue";
import { useApi } from "~/composables/useApi";
import MediaUploader from "~/assets/MediaUploader.vue";

const emit = defineEmits<{
  "file-uploaded": [file: File | null];
}>();

const { geminiRequest } = useApi();

interface Message {
  texto: string;
  ai: boolean;
}

const mensajes = ref<Message[]>([
  { texto: "Hola, soy tu asistente IA. ¿En qué puedo ayudarte?", ai: true },
]);

const inputMessage = ref("");
const isLoading = ref(false);
const mediaFile = ref<File | null>(null);

const handleFileUploaded = (file: File | null) => {
  mediaFile.value = file;
  emit("file-uploaded", file);
};

const mediaUrl = computed(() => {
  if (mediaFile.value) {
    return URL.createObjectURL(mediaFile.value);
  }
  return null;
});

const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return;

  const userMessage: Message = { texto: inputMessage.value, ai: false };
  mensajes.value.push(userMessage);
  const prompt = inputMessage.value;
  inputMessage.value = "";
  isLoading.value = true;

  try {
    const response = await geminiRequest(prompt);
    if (response.success) {
      const aiMessage: Message = { texto: response.data, ai: true };
      mensajes.value.push(aiMessage);
    } else {
      const errorMessage: Message = {
        texto: "Error: " + response.message,
        ai: true,
      };
      mensajes.value.push(errorMessage);
    }
  } catch (error) {
    const errorMessage: Message = {
      texto: "Error al conectar con la IA",
      ai: true,
    };
    mensajes.value.push(errorMessage);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div
    class="flex flex-col w-full bg-white rounded-xl shadow-lg border border-gray-100 h-full max-h-[600px]"
  >
    <!-- Chat Header -->
    <div class="p-4 border-b bg-indigo-50 rounded-t-xl">
      <h3 class="font-bold text-xl text-indigo-800 flex items-center gap-2">
        <img class="size-6" src="/assets/gemini.svg" alt="AI Icon" />
        Asistente IA (Gemini)
      </h3>
    </div>

    <!-- Media Uploader Section -->
    <div class="p-4 border-b bg-gray-50">
      <MediaUploader @file-uploaded="handleFileUploaded" />
    </div>

    <!-- Media Preview Section -->
    <div v-if="mediaFile" class="p-4 border-b bg-white">
      <div class="w-full max-w-sm mx-auto">
        <div
          class="aspect-square w-full bg-gray-200 flex items-center justify-center rounded-lg overflow-hidden"
        >
          <img
            v-if="mediaUrl"
            :src="mediaUrl"
            alt="Post media preview"
            class="object-cover w-full h-full"
          />
        </div>
        <p class="text-center text-sm text-gray-600 mt-2">
          Vista previa de la imagen
        </p>
      </div>
    </div>

    <!-- Messages Area -->
    <div class="flex-1 p-4 space-y-4 overflow-y-auto">
      <div
        v-for="(mensaje, index) in mensajes"
        :key="index"
        class="flex"
        :class="{ 'justify-end': !mensaje.ai, 'justify-start': mensaje.ai }"
      >
        <div
          class="max-w-[80%] p-3 rounded-xl shadow-md"
          :class="{
            'bg-indigo-600 text-white rounded-br-none': !mensaje.ai,
            'bg-gray-100 text-gray-800 rounded-tl-none': mensaje.ai,
          }"
        >
          <p
            class="text-xs font-semibold mb-1"
            :class="{
              'text-indigo-200': !mensaje.ai,
              'text-gray-500': mensaje.ai,
            }"
          >
            {{ mensaje.ai ? "Gemini" : "Tú" }}
          </p>
          <p>{{ mensaje.texto }}</p>
        </div>
      </div>
      <div v-if="isLoading" class="flex justify-start">
        <div
          class="max-w-[80%] p-3 rounded-xl shadow-md bg-gray-100 text-gray-800 rounded-tl-none"
        >
          <p class="text-xs font-semibold mb-1 text-gray-500">Gemini</p>
          <p>Escribiendo...</p>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="p-4 border-t bg-gray-50 rounded-b-xl">
      <div class="flex gap-2">
        <textarea
          v-model="inputMessage"
          @keyup.enter="sendMessage"
          placeholder="Escribe tu mensaje al Asistente IA..."
          class="resize-none p-3 flex-1 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          rows="2"
          :disabled="isLoading"
        />
        <button
          @click="sendMessage"
          :disabled="!inputMessage.trim() || isLoading"
          class="p-3 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
        >
          <img src="/assets/send.svg" class="size-6 invert" alt="Send" />
        </button>
      </div>
    </div>
  </div>
</template>
