<script setup lang="ts">
// Define navigation links
const navLinks = [
  { name: "Inicio", to: "/" },
  { name: "Contenido", to: "/content" },
  { name: "Programación", to: "/programing" },
  { name: "Moderación", to: "/mod" },
];
</script>

<template>
  <header class="bg-white shadow-md sticky top-0 z-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo/App Name -->
        <NuxtLink to="/" class="flex items-center">
          <img
            src="/assets/gemini.svg"
            class="h-8 w-auto text-indigo-600"
            alt="Logo"
          />
          <span class="ml-2 text-2xl font-extrabold text-indigo-600"
            >Tavi AI</span
          >
        </NuxtLink>

        <!-- Navigation Links -->
        <nav class="hidden md:block">
          <div class="flex space-x-4">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.name"
              :to="link.to"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              active-class="bg-indigo-100 text-indigo-700"
            >
              {{ link.name }}
            </NuxtLink>
          </div>
        </nav>

        <!-- User/Action Button (Mock) -->
        <div class="flex items-center">
          <button
            class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-md"
          >
            Mi Cuenta
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
