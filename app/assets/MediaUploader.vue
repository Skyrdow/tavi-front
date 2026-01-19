<script setup lang="ts">
const url = defineModel<string | null>({ default: null });
</script>

<template>
  <div class="p-6 border-2 border-dashed border-indigo-400 bg-indigo-50 rounded-xl">
    <label class="block text-indigo-800 font-bold text-lg mb-4">
      Ingresa la URL de la imagen
    </label>
    <input
      v-model="url"
      type="url"
      placeholder="https://example.com/image.jpg"
      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
</template>
