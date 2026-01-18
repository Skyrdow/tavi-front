<script setup lang="ts">
import { useAuth } from "~/composables/useAuth";
import { useRouter } from "vue-router";

const { isAuthenticated, logout } = useAuth();
const router = useRouter();

const navLinks = [
  { name: "Inicio", to: "/" },
  { name: "Contenido", to: "/content" },
  { name: "Programación", to: "/programing" },
  { name: "Moderación", to: "/mod" },
];

const handleLogout = () => {
  logout();
  router.push("/login");
};

const connectInstagram = async () => {
  const token = localStorage.getItem("auth_token");
  if (!token) {
    console.error("Token no encontrado");
    return;
  }

  try {
    const backendUrl =
      "https://llm-cm-agent-backend.onrender.com/api/v1/auth/instagram/login";

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      redirect: "manual",
    });
    console.log("=====================");
    console.log(response);

    console.log(token);
    if (response.type === "opaqueredirect" || response.status === 302) {
      window.location.href = `${backendUrl}?token=${token}`;
    } else {
      window.location.href = `${backendUrl}?token=${token}`;
    }
  } catch (error) {
    console.error("Error:", error);
    window.location.href = `https://llm-cm-agent-backend.onrender.com/api/v1/auth/instagram/login?token=${token}`;
  }
};
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

        <!-- User/Action Button -->
        <div class="flex items-center gap-3">
          <button
            v-if="isAuthenticated"
            @click="connectInstagram"
            class="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-colors shadow-md flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
              />
            </svg>
            Conectar Instagram
          </button>
          <button
            v-if="isAuthenticated"
            @click="handleLogout"
            class="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-md"
          >
            Cerrar Sesión
          </button>
          <NuxtLink
            v-else
            to="/login"
            class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-md"
          >
            Iniciar Sesión
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>
