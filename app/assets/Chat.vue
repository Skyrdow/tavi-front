<script setup lang="ts">
let mensajes = [
  { texto: "Hola, dame un lorem ipsum", ai: false },
  { texto: "Listo, aca esta tu lorem", ai: true },
  {
    texto:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut semper metus in mi efficitur, in rutrum sapien luctus. Vestibulum egestas felis venenatis gravida blandit. Nullam fermentum gravida auctor. ",
    ai: true,
  },
];
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
    </div>

    <!-- Input Area -->
    <div class="p-4 border-t bg-gray-50 rounded-b-xl">
      <div class="flex gap-2">
        <textarea
          placeholder="Escribe tu mensaje al Asistente IA..."
          class="resize-none p-3 flex-1 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          rows="2"
        />
        <button
          class="p-3 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
        >
          <img src="/assets/send.svg" class="size-6 invert" alt="Send" />
        </button>
      </div>
    </div>
  </div>
</template>
