<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "~/composables/useAuth";
import { useRouter } from "vue-router";

const { login } = useAuth();
const router = useRouter();

const username = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

const handleLogin = async () => {
  if (!username.value.trim()) {
    error.value = "El usuario es requerido";
    return;
  }
  if (password.value.length < 8) {
    error.value = "La contraseña debe tener al menos 8 caracteres";
    return;
  }
  loading.value = true;
  error.value = "";
  const result = await login(username.value, password.value);
  loading.value = false;
  if (result.success) {
    router.push("/content");
  } else {
    error.value = result.message || "Error desconocido";
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Iniciar Sesión
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">Usuario</label>
            <input
              id="username"
              v-model="username"
              name="username"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Usuario"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Contraseña</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Contraseña"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-600 text-sm">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
          >
            <span
              v-if="loading"
              class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
            ></span>
            <span v-else>Iniciar Sesión</span>
          </button>
        </div>

        <div class="text-center">
          <router-link
            to="/register"
            class="text-indigo-600 hover:text-indigo-500"
          >
            ¿No tienes cuenta? Regístrate
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>
