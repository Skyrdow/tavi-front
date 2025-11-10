<template>
  <div class="bg-gray-50 min-h-screen pt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Hero Section -->
      <div class="text-center py-20 md:py-32">
        <h1 class="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-4">
          Tu <span class="text-indigo-600">Community Manager</span> con IA
        </h1>
        <p class="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
          Tavi AI ayuda a pequeñas empresas a generar contenido, programar publicaciones y moderar interacciones con clientes de forma automática y eficiente.
        </p>
        <div class="mt-10 flex justify-center space-x-4">
          <NuxtLink
            to="/content"
            class="px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 shadow-xl transition-colors"
          >
            Empezar a Crear Contenido
          </NuxtLink>
          <NuxtLink
            to="/mod"
            class="px-8 py-3 border border-indigo-200 text-base font-medium rounded-lg text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10 transition-colors"
          >
            Ver Moderación
          </NuxtLink>
        </div>
      </div>

      <!-- Features Section (Mock) -->
      <div class="py-16">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">Funcionalidades Clave</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
          <!-- Feature 1 -->
          <div class="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
            <div class="flex justify-center mb-4">
              <svg class="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Generación de Contenido IA</h3>
            <p class="text-gray-600">Crea descripciones, hashtags y etiquetas perfectas para tus fotos y videos en segundos.</p>
          </div>
          <!-- Feature 2 -->
          <div class="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
            <div class="flex justify-center mb-4">
              <svg class="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Programación Visual</h3>
            <p class="text-gray-600">Organiza y visualiza tu calendario de publicaciones con una vista mensual intuitiva.</p>
          </div>
          <!-- Feature 3 -->
          <div class="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
            <div class="flex justify-center mb-4">
              <svg class="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Moderación Inteligente</h3>
            <p class="text-gray-600">Recibe sugerencias de respuesta IA para comentarios y mensajes directos, y envíalas al instante.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
