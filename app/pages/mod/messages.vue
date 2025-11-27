<script setup lang="ts">
import { ref, computed } from "vue";

interface ChatMessage {
  id: number;
  text: string;
  time: string;
  sender: "client" | "business";
}

interface Conversation {
  id: number;
  clientUser: string;
  platform: "WhatsApp" | "Instagram DM";
  messages: ChatMessage[];
  // State for the current response
  suggestedResponse: string;
  response: string;
  isResponsePending: boolean;
}

const conversations = ref<Conversation[]>([
  {
    id: 1,
    clientUser: "interesado_1",
    platform: "WhatsApp",
    messages: [
      {
        id: 101,
        text: "Hola, estoy interesado en el servicio de community manager. ¿Me pueden dar más detalles?",
        time: "Hace 10 minutos",
        sender: "client",
      },
      {
        id: 102,
        text: "Claro, ¿cuáles son los precios?",
        time: "Hace 8 minutos",
        sender: "business",
      },
    ],
    suggestedResponse:
      "¡Hola! Con gusto te ayudamos. ¿Podrías indicarnos el rubro de tu negocio para enviarte la información más relevante?",
    response: "",
    isResponsePending: true,
  },
  {
    id: 2,
    clientUser: "pregunta_rapida",
    platform: "Instagram DM",
    messages: [
      {
        id: 201,
        text: "¿Cuál es el horario de atención?",
        time: "Hace 3 horas",
        sender: "client",
      },
      {
        id: 202,
        text: "Nuestro horario de atención es de Lunes a Viernes de 9:00 a 18:00 hrs. ¡Estamos para servirte!",
        time: "Hace 2 horas",
        sender: "business",
      },
      {
        id: 203,
        text: "Perfecto, gracias.",
        time: "Hace 1 hora",
        sender: "client",
      },
    ],
    suggestedResponse:
      "¡De nada! ¿Hay algo más en lo que podamos ayudarte hoy?",
    response: "",
    isResponsePending: true,
  },
]);

const activeConversation = ref<Conversation | null>(conversations.value[0]);

const selectConversation = (conversation: Conversation) => {
  activeConversation.value = conversation;
  // Initialize response with AI suggestion if not already set
  if (!activeConversation.value.response) {
    activeConversation.value.response =
      activeConversation.value.suggestedResponse;
  }
};

const sendMessage = (conversation: Conversation) => {
  // 1. Mock API call to send message
  console.log(
    `Enviando mensaje a ${conversation.clientUser}: ${conversation.response}`,
  );
  alert(`Mensaje enviado a ${conversation.clientUser}`);

  // 2. Add the response to the chat history
  conversation.messages.push({
    id: Date.now(), // Mock ID
    text: conversation.response,
    time: "Ahora", // Mock time
    sender: "business",
  });

  // 3. Clear response state and mark as not pending (until a new client message arrives)
  conversation.response = "";
  conversation.suggestedResponse = ""; // Clear suggestion for next time
  conversation.isResponsePending = false;
};

const totalPendingConversations = computed(() => {
  return conversations.value.filter((c) => c.isResponsePending).length;
});
</script>

<template>
  <div class="grid grid-cols-3 gap-6 min-h-[80vh]">
    <!-- Left Panel: Conversation List -->
    <div
      class="col-span-1 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
    >
      <h2 class="text-xl font-bold p-4 border-b bg-gray-50 text-gray-800">
        Chats Pendientes ({{ totalPendingConversations }})
      </h2>
      <div class="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">
        <div
          v-for="conversation in conversations"
          :key="conversation.id"
          class="p-4 cursor-pointer hover:bg-indigo-50 transition-colors"
          :class="{
            'bg-indigo-100 border-l-4 border-indigo-500':
              activeConversation?.id === conversation.id,
          }"
          @click="selectConversation(conversation)"
        >
          <div class="flex justify-between text-sm text-gray-500">
            <span class="font-semibold text-gray-700">{{
              conversation.clientUser
            }}</span>
            <span class="text-xs">{{
              conversation.messages[conversation.messages.length - 1].time
            }}</span>
          </div>
          <p class="mt-1 text-gray-800 truncate">
            {{ conversation.messages[conversation.messages.length - 1].text }}
          </p>
          <span class="text-xs font-medium text-indigo-600">{{
            conversation.platform
          }}</span>
          <span
            v-if="conversation.isResponsePending"
            class="ml-2 text-xs font-bold text-red-500"
            >¡PENDIENTE!</span
          >
        </div>
      </div>
    </div>

    <!-- Right Panel: Chat History and Response Editor -->
    <div
      v-if="activeConversation"
      class="col-span-2 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col"
    >
      <h2 class="text-2xl font-bold p-4 border-b text-gray-800">
        Chat con {{ activeConversation.clientUser }} ({{
          activeConversation.platform
        }})
      </h2>

      <!-- Chat History -->
      <div class="flex-1 p-6 space-y-4 overflow-y-auto max-h-[60vh]">
        <div
          v-for="message in activeConversation.messages"
          :key="message.id"
          class="flex"
          :class="{
            'justify-end': message.sender === 'business',
            'justify-start': message.sender === 'client',
          }"
        >
          <div
            class="max-w-[80%] p-3 rounded-xl shadow-md"
            :class="{
              'bg-indigo-600 text-white rounded-br-none':
                message.sender === 'business',
              'bg-gray-100 text-gray-800 rounded-tl-none':
                message.sender === 'client',
            }"
          >
            <p
              class="text-xs font-semibold mb-1"
              :class="{
                'text-indigo-200': message.sender === 'business',
                'text-gray-500': message.sender === 'client',
              }"
            >
              {{
                message.sender === "business"
                  ? "Tú"
                  : activeConversation.clientUser
              }}
            </p>
            <p>{{ message.text }}</p>
            <span
              class="block text-right text-xs mt-1"
              :class="{
                'text-indigo-300': message.sender === 'business',
                'text-gray-500': message.sender === 'client',
              }"
              >{{ message.time }}</span
            >
          </div>
        </div>
      </div>

      <!-- AI Suggestion and Response Editor -->
      <div class="p-6 border-t bg-gray-50 rounded-b-xl">
        <div v-if="activeConversation.isResponsePending" class="mb-4">
          <h3
            class="font-semibold text-indigo-600 flex items-center gap-2 mb-2"
          >
            <img class="size-5" src="/assets/gemini.svg" alt="AI Icon" />
            Sugerencia de Respuesta IA:
          </h3>
          <p
            class="mt-2 p-3 bg-indigo-100 border-l-4 border-indigo-400 text-gray-700 rounded-r-md text-sm"
          >
            {{ activeConversation.suggestedResponse }}
          </p>
        </div>

        <h3 class="font-semibold text-lg mb-2 text-gray-800">
          Tu Respuesta (Editable)
        </h3>
        <textarea
          v-model="activeConversation.response"
          rows="4"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          placeholder="Edita la sugerencia de la IA o escribe tu propia respuesta..."
        ></textarea>
        <button
          @click="sendMessage(activeConversation)"
          :disabled="!activeConversation.response.trim()"
          class="mt-3 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
        >
          Enviar Mensaje
        </button>
      </div>
    </div>
    <div
      v-else
      class="col-span-2 flex items-center justify-center text-gray-500 bg-white rounded-xl shadow-lg border border-gray-200"
    >
      <p class="text-lg">Selecciona un chat para moderar.</p>
    </div>
  </div>
</template>
