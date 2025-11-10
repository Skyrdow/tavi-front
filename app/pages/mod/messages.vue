<script setup lang="ts">
import { ref } from 'vue';

interface Message {
  id: number;
  user: string;
  text: string;
  time: string;
  platform: 'WhatsApp' | 'Instagram DM';
  suggestedResponse: string;
  response: string;
}

const messages = ref<Message[]>([
  {
    id: 1,
    user: 'interesado_1',
    text: 'Hola, estoy interesado en el servicio de community manager. ¿Me pueden dar más detalles?',
    time: 'Hace 10 minutos',
    platform: 'WhatsApp',
    suggestedResponse: '¡Hola! Con gusto te ayudamos. ¿Podrías indicarnos el rubro de tu negocio para enviarte la información más relevante?',
    response: '',
  },
  {
    id: 2,
    user: 'pregunta_rapida',
    text: '¿Cuál es el horario de atención?',
    time: 'Hace 3 horas',
    platform: 'Instagram DM',
    suggestedResponse: 'Nuestro horario de atención es de Lunes a Viernes de 9:00 a 18:00 hrs. ¡Estamos para servirte!',
    response: '',
  },
]);

const activeMessage = ref<Message | null>(messages.value[0]);

const selectMessage = (message: Message) => {
  activeMessage.value = message;
  // Initialize response with AI suggestion if not already set
  if (!activeMessage.value.response) {
    activeMessage.value.response = activeMessage.value.suggestedResponse;
  }
};

const sendMessage = (message: Message) => {
  // Mock API call to send message
  console.log(`Enviando mensaje a ${message.user}: ${message.response}`);
  alert(`Mensaje enviado a ${message.user}`);
  // In a real app, you would update the message status here
};
</script>

<template>
  <div class="grid grid-cols-3 gap-6 min-h-[80vh]">
    <!-- Left Panel: Message List -->
    <div class="col-span-1 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <h2 class="text-xl font-bold p-4 border-b bg-gray-50 text-gray-800">Mensajes Pendientes ({{ messages.length }})</h2>
      <div class="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">
        <div
          v-for="message in messages"
          :key="message.id"
          class="p-4 cursor-pointer hover:bg-indigo-50 transition-colors"
          :class="{ 'bg-indigo-100 border-l-4 border-indigo-500': activeMessage?.id === message.id }"
          @click="selectMessage(message)"
        >
          <div class="flex justify-between text-sm text-gray-500">
            <span class="font-semibold text-gray-700">{{ message.user }}</span>
            <span class="text-xs">{{ message.time }}</span>
          </div>
          <p class="mt-1 text-gray-800 truncate">{{ message.text }}</p>
          <span class="text-xs font-medium text-indigo-600">{{ message.platform }}</span>
        </div>
      </div>
    </div>

    <!-- Right Panel: Message Detail and Response -->
    <div v-if="activeMessage" class="col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">Detalle del Mensaje</h2>

      <!-- Original Message -->
      <div class="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p class="font-semibold text-lg text-gray-900">{{ activeMessage.user }}</p>
        <p class="text-gray-700 mt-1">{{ activeMessage.text }}</p>
        <span class="text-xs text-gray-500">{{ activeMessage.platform }} - {{ activeMessage.time }}</span>
      </div>

      <!-- AI Suggestion -->
      <div class="mb-6">
        <h3 class="font-semibold text-indigo-600 flex items-center gap-2">
          <img class="size-5" src="/assets/gemini.svg" alt="AI Icon" />
          Sugerencia de Respuesta IA:
        </h3>
        <p class="mt-2 p-3 bg-indigo-50 border-l-4 border-indigo-400 text-gray-700 rounded-r-md">
          {{ activeMessage.suggestedResponse }}
        </p>
      </div>

      <!-- User Response Editor -->
      <div class="mt-6">
        <h3 class="font-semibold text-lg mb-2 text-gray-800">Tu Respuesta (Editable)</h3>
        <textarea
          v-model="activeMessage.response"
          rows="4"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          placeholder="Edita la sugerencia de la IA o escribe tu propia respuesta..."
        ></textarea>
        <button
          @click="sendMessage(activeMessage)"
          :disabled="!activeMessage.response.trim()"
          class="mt-3 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
        >
          Enviar Mensaje
        </button>
      </div>
    </div>
    <div v-else class="col-span-2 flex items-center justify-center text-gray-500 bg-white rounded-xl shadow-lg border border-gray-200">
      <p class="text-lg">Selecciona un mensaje para moderar.</p>
    </div>
  </div>
</template>