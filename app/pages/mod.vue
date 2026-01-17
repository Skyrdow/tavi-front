<script setup lang="ts"></script>

<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">Panel de Moderación</h1>

    <div class="flex gap-4 mb-6 border-b pb-2">
      <NuxtLink
        to="/mod"
        class="text-lg font-medium text-gray-600 hover:text-indigo-800 transition-colors pb-2 border-b-2 border-transparent"
        exact-active-class="text-indigo-600 border-indigo-600"
      >
        Mensajes
      </NuxtLink>
    </div>

    <NuxtPage />
  </div>
</template>
