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
  <div class="flex flex-col w-full bg-green-100">
    <div class="flex-1">
      <div v-for="(mensaje, index) in mensajes">
        <span v-if="index != 0"> -------------------------------- </span>
        <div
          class="p-2 m-1"
          :class="{ 'bg-blue-50': mensaje.ai, 'bg-yellow-50': !mensaje.ai }"
        >
          <p>
            <span class="flex items-center gap-2 ml-2">
              <img class="size-6" v-if="mensaje.ai" src="/assets/gemini.svg" />
              <img
                class="size-6"
                v-if="!mensaje.ai"
                src="/assets/account.svg"
              />
              <i>{{ mensaje.ai ? "Gemini" : "nombre.negocio" }}</i>
            </span>
            {{ mensaje.texto }}
          </p>
        </div>
      </div>
    </div>

    <div class="inline-flex bg-white gap-1 m-1 p-2">
      <textarea
        placeholder="Escribe tu mensaje a CManager"
        class="resize-none p-2 flex-1 max-h-16"
      />
      <button>
        <img src="/assets/send.svg" class="p-1 bg-gray-100 hover:bg-gray-200" />
      </button>
    </div>
  </div>
</template>
