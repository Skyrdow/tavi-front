<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "~/composables/useAuth";
import { useRouter } from "vue-router";

const { token, createTenant } = useAuth();
const router = useRouter();

const form = ref({
  name: "",
  slug: "",
  category: "",
  businessInfo: "",
  agentPrompt: "",
});
const error = ref("");
const success = ref("");
const loading = ref(false);

const handleCreateTenant = async () => {
  loading.value = true;
  error.value = "";
  success.value = "";
  const result = await createTenant(token.value ?? "", form.value);
  loading.value = false;
  if (result.success) {
    success.value = result.message || "Negocio creado correctamente.";
    // Redirect to login after success
    setTimeout(() => router.push("/login"), 2000);
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
          Crear Negocio
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Ingresa los detalles de tu negocio.
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleCreateTenant">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="name" class="sr-only">Nombre del Negocio</label>
            <input
              id="name"
              v-model="form.name"
              name="name"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Nombre del Negocio"
            />
          </div>
          <div>
            <label for="slug" class="sr-only">Slug (Nombre de Usuario)</label>
            <input
              id="slug"
              v-model="form.slug"
              name="slug"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Slug (Nombre de Usuario)"
            />
          </div>
          <div>
            <label for="category" class="sr-only">Categoría</label>
            <input
              id="category"
              v-model="form.category"
              name="category"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Categoría"
            />
          </div>
          <div>
            <label for="businessInfo" class="sr-only"
              >Información del Negocio</label
            >
            <textarea
              id="businessInfo"
              v-model="form.businessInfo"
              name="businessInfo"
              rows="4"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Información del Negocio"
            ></textarea>
          </div>
          <div>
            <label for="agentPrompt" class="sr-only">Agent Prompt</label>
            <textarea
              id="agentPrompt"
              v-model="form.agentPrompt"
              name="agentPrompt"
              rows="4"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Agent Prompt"
            ></textarea>
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
            <span v-else>Crear Negocio</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
