<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useApi } from "~/composables/useApi";
import { useAuth } from "~/composables/useAuth";

definePageMeta({
  middleware: "auth",
});

const { getComments } = useApi();
const { token, tenantId } = useAuth();
const loading = ref(true);
const error = ref("");
const comments = ref<any[]>([]);

const fetchComments = async () => {
  loading.value = true;
  error.value = "";
  if (!tenantId.value) {
    error.value = "Tenant ID no encontrado";
    loading.value = false;
    return;
  }
  try {
    const response = (await getComments(
      token.value || "",
      tenantId.value,
    )) as any;

    if (response.success) {
      comments.value = response.data || [];
    } else {
      error.value = response.message || "Error al cargar comentarios";
    }
  } catch (e) {
    error.value = "Error de conexión";
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(() => {
  fetchComments();
});
</script>

<template>
  <div class="grid grid-cols-3 gap-6 min-h-[80vh]">
    <div
      class="col-span-1 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
    >
      <h2 class="text-xl font-bold p-4 border-b bg-gray-50 text-gray-800">
        Comentarios ({{ comments.length }})
      </h2>
      <div v-if="loading" class="p-4 text-gray-500 text-center">
        Cargando...
      </div>
      <div v-else-if="error" class="p-4 text-red-500 text-center">
        {{ error }}
      </div>
      <div
        v-else-if="comments.length === 0"
        class="p-4 text-gray-500 text-center"
      >
        No hay comentarios
      </div>
      <div v-else class="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="p-4 hover:bg-gray-50 transition-colors"
        >
          <div class="flex justify-between text-sm text-gray-500">
            <span class="font-semibold text-gray-700">{{
              comment.user || comment.username
            }}</span>
            <span class="text-xs">{{ formatDate(comment.createdAt) }}</span>
          </div>
          <p class="mt-1 text-gray-800">{{ comment.comment }}</p>
        </div>
      </div>
    </div>

    <div
      class="col-span-2 bg-white rounded-xl shadow-lg border border-gray-200 flex items-center justify-center"
    >
      <p class="text-lg text-gray-500">
        Selecciona un comentario para ver detalles.
      </p>
    </div>
  </div>
</template>
