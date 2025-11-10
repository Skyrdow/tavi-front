<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
  (e: "file-uploaded", file: File | null): void;
}>();
const fileName = ref<string | null>(null);

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    fileName.value = file.name;
    emit("file-uploaded", file);
  } else {
    // Handle case where file selection is cleared or cancelled
    fileName.value = null;
    emit("file-uploaded", null);
  }
};
</script>

<template>
  <div
    class="p-6 border-2 border-dashed border-indigo-400 bg-indigo-50 rounded-xl text-center cursor-pointer hover:border-indigo-600 transition-all duration-200"
  >
    <input
      type="file"
      @change="handleFileUpload"
      class="hidden"
      id="file-upload"
      accept="image/*,video/*"
    />
    <label for="file-upload" class="block w-full h-full py-8">
      <div class="flex flex-col items-center justify-center">
        <svg v-if="!fileName" class="w-10 h-10 text-indigo-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        <p class="text-indigo-800 font-bold text-lg">
          {{ fileName ? `Archivo seleccionado: ${fileName}` : "Haz clic para subir fotos o videos" }}
        </p>
        <p v-if="!fileName" class="text-sm text-indigo-600 mt-1">
          Arrastra y suelta también es compatible (Max 50MB)
        </p>
      </div>
    </label>
  </div>
</template>