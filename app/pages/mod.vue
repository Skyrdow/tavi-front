<script setup lang="ts">
// This is the layout file for /mod and /mod/messages
</script>

<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">Panel de Moderación</h1>

    <div class="flex gap-4 mb-6 border-b pb-2">
      <NuxtLink to="/mod" class="text-lg font-medium text-blue-600 hover:text-blue-800 border-b-2 border-blue-600">
        Comentarios
      </NuxtLink>
      <NuxtLink to="/mod/messages" class="text-lg font-medium text-gray-600 hover:text-gray-800">
        Mensajes Directos
      </NuxtLink>
    </div>

    <NuxtPage />
  </div>
</template>
