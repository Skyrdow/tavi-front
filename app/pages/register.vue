<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "~/composables/useAuth";
import { useRouter } from "vue-router";

const { register } = useAuth();
const router = useRouter();

const form = ref({
  names: "",
  lastnames: "",
  rut: "",
  dv: "",
  email: "",
});
const error = ref("");
const success = ref("");
const loading = ref(false);

const handleRegister = async () => {
  loading.value = true;
  error.value = "";
  success.value = "";
  const result = await register(form.value);
  loading.value = false;
  if (result.success) {
    success.value =
      result.message || "Registro exitoso. Revisa tu email para verificar.";
    setTimeout(
      () =>
        router.push({ path: "/verify", query: { email: form.value.email } }),
      2000,
    );
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
          Crear Cuenta
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="names" class="sr-only">Nombres</label>
            <input
              id="names"
              v-model="form.names"
              name="names"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Nombres"
            />
          </div>
          <div>
            <label for="lastnames" class="sr-only">Apellidos</label>
            <input
              id="lastnames"
              v-model="form.lastnames"
              name="lastnames"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Apellidos"
            />
          </div>
          <div class="flex">
            <input
              id="rut"
              v-model="form.rut"
              name="rut"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="RUT (sin dígito verificador)"
            />
            <input
              id="dv"
              v-model="form.dv"
              name="dv"
              type="text"
              required
              class="appearance-none rounded-none relative block w-16 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="DV"
              maxlength="1"
            />
          </div>
          <div>
            <label for="email" class="sr-only">Email</label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email"
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
            <span v-else>Registrar</span>
          </button>
        </div>

        <div class="text-center">
          <router-link
            to="/login"
            class="text-indigo-600 hover:text-indigo-500"
          >
            ¿Ya tienes cuenta? Inicia sesión
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>
