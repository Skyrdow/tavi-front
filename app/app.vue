<template>
  <nav class="flex items-center p-2 justify-evenly">
    <span class="flex items-center gap-2">
      <img src="/favicon.ico" />
      <h1 class="">Easy CManager</h1>
    </span>
    <span class="flex items-center gap-4">
      <NuxtLink class="hover:underline" href="/content">Contenido</NuxtLink>
      <NuxtLink class="hover:underline" href="/programing">Programación</NuxtLink>
      <NuxtLink class="hover:underline" href="/mod">Moderación</NuxtLink>
    </span>
  </nav>
  <NuxtPage />
</template>
