<script setup lang="ts">
import { ref } from "vue";
import { useApi } from "~/composables/useApi";

interface Props {
  currentDescription: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "file-uploaded": [file: File | null];
  "description-update": [description: string];
}>();

const { geminiRequest } = useApi();

interface Message {
  texto: string;
  ai: boolean;
  suggestedText?: string;
}

const mensajes = ref<Message[]>([
  {
    texto:
      "Hola, soy tu asistente IA. Puedo ayudarte a mejorar la descripción de tu publicación. ¿Qué cambios te gustaría hacer?",
    ai: true,
  },
]);

const inputMessage = ref("");
const isLoading = ref(false);

const resetChat = () => {
  mensajes.value = [
    {
      texto:
        "Hola, soy tu asistente IA. Puedo ayudarte a mejorar la descripción de tu publicación. ¿Qué cambios te gustaría hacer?",
      ai: true,
    },
  ];
};

const applySuggestion = (suggestedText: string) => {
  emit("description-update", suggestedText);
  mensajes.value.push({
    texto: `Descripción actualizada: "${suggestedText}"`,
    ai: true,
  });
};

const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return;

  const userMessage: Message = { texto: inputMessage.value, ai: false };
  mensajes.value.push(userMessage);
  const prompt = `Descripción actual: "${props.currentDescription}". Solicitud del usuario: ${inputMessage.value}. Por favor, proporciona una versión mejorada de la descripción basada en esta solicitud.`;
  inputMessage.value = "";
  isLoading.value = true;

  try {
    const response = await geminiRequest(prompt);
    if (response.success) {
      const aiMessage: Message = {
        texto: response.data,
        ai: true,
        suggestedText: response.data,
      };
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
    class="flex flex-col w-full bg-white rounded-xl shadow-lg border border-gray-100 h-full max-h-[500px]"
  >
    <!-- Chat Header -->
    <div
      class="p-4 border-b bg-indigo-50 rounded-t-xl flex justify-between items-center"
    >
      <h3 class="font-bold text-lg text-indigo-800 flex items-center gap-2">
        <img class="size-5" src="/assets/gemini.svg" alt="AI Icon" />
        Asistente IA para Descripción
      </h3>
      <button
        @click="resetChat"
        class="text-sm text-indigo-600 hover:text-indigo-800 underline"
      >
        Reiniciar conversación
      </button>
    </div>

    <!-- Messages Area -->
    <div class="flex-1 p-4 space-y-4 overflow-y-auto">
      <div
        v-for="(mensaje, index) in mensajes"
        :key="index"
        class="flex flex-col"
        :class="{ 'items-end': !mensaje.ai, 'items-start': mensaje.ai }"
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
          <button
            v-if="mensaje.ai && mensaje.suggestedText"
            @click="applySuggestion(mensaje.suggestedText)"
            class="mt-2 text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition-colors"
          >
            Aplicar sugerencia
          </button>
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
          placeholder="Describe cómo quieres modificar la descripción..."
          class="resize-none p-3 flex-1 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          rows="2"
          :disabled="isLoading"
        />
        <button
          @click="sendMessage"
          :disabled="!inputMessage.trim() || isLoading"
          class="p-3 bg-indigo-600 cursor-pointer rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
        >
          <img src="/assets/send.svg" class="size-6 invert" alt="Send" />
        </button>
      </div>
    </div>
  </div>
</template>
