<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuth } from "~/composables/useAuth";
import { useRouter, useRoute } from "vue-router";

const { token, verify, tempEmail } = useAuth();
const router = useRouter();
const route = useRoute();

const email = ref("");
const code = ref("");
const error = ref("");
const success = ref("");
const loading = ref(false);

onMounted(() => {
  email.value = (route.query.email as string) || tempEmail.value || "";
});

const handleVerify = async () => {
  loading.value = true;
  error.value = "";
  success.value = "";
  const result = await verify(token.value ?? "", code.value);
  loading.value = false;
  if (result.success) {
    success.value = result.message || "Cuenta verificada correctamente.";
    setTimeout(() => router.push("/create-tenant"), 2000);
  } else {
    error.value = result.message || "Error desconocido";
  }
};
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verificar Cuenta
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Ingresa el código de verificación enviado a tu email.
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleVerify">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Email</label>
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email"
            />
          </div>
          <div>
            <label for="code" class="sr-only">Código de Verificación</label>
            <input
              id="code"
              v-model="code"
              name="code"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Código de Verificación"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-600 text-sm">
          {{ error }}
        </div>

        <div v-if="success" class="text-green-600 text-sm">
          {{ success }}
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
            <span v-else>Verificar</span>
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
