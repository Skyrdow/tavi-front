<script setup lang="ts">
import { ref } from 'vue';

interface Comment {
  id: number;
  user: string;
  text: string;
  time: string;
  platform: 'Instagram' | 'Facebook';
  suggestedResponse: string;
  response: string;
  isReplySent: boolean;
}

interface Post {
  id: number;
  caption: string;
  thumbnailUrl: string;
  platform: 'Instagram' | 'Facebook';
  comments: Comment[];
}

const mockPosts = ref<Post[]>([
  {
    id: 101,
    caption: '¡Nuevo lanzamiento! 🚀 Descubre nuestra colección de invierno...',
    thumbnailUrl: '/account.svg', // Placeholder
    platform: 'Instagram',
    comments: [
      {
        id: 1,
        user: 'cliente_feliz',
        text: '¡Me encanta el nuevo producto! ¿Tienen más colores?',
        time: 'Hace 5 minutos',
        platform: 'Instagram',
        suggestedResponse: '¡Hola! Nos alegra que te guste. Sí, tenemos 3 colores más. ¿Cuál te gustaría ver?',
        response: '',
        isReplySent: false,
      },
      {
        id: 2,
        user: 'usuario_duda',
        text: 'El precio me parece un poco alto. ¿Hay algún descuento?',
        time: 'Hace 1 hora',
        platform: 'Instagram',
        suggestedResponse: 'Entendemos tu preocupación. Actualmente tenemos una promoción del 15% por tiempo limitado. ¡Aprovecha!',
        response: '',
        isReplySent: false,
      },
    ],
  },
  {
    id: 102,
    caption: 'Tips para mejorar tu productividad en 2024. 💡',
    thumbnailUrl: '/account.svg', // Placeholder
    platform: 'Facebook',
    comments: [
      {
        id: 3,
        user: 'fan_page',
        text: 'Muy buenos consejos, ¡gracias por compartir!',
        time: 'Hace 3 horas',
        platform: 'Facebook',
        suggestedResponse: '¡De nada! Nos alegra que te sean útiles. ¡Síguenos para más tips!',
        response: '',
        isReplySent: false,
      },
    ],
  },
]);

const activePost = ref<Post | null>(mockPosts.value[0]);
const activeCommentId = ref<number | null>(null);

const selectPost = (post: Post) => {
  activePost.value = post;
  activeCommentId.value = null; // Clear active comment when changing post
};

const selectComment = (comment: Comment) => {
  activeCommentId.value = comment.id;
  // Initialize response with AI suggestion if not already set
  if (!comment.response) {
    comment.response = comment.suggestedResponse;
  }
};

const sendResponse = (comment: Comment) => {
  // Mock API call to send response
  console.log(`Enviando respuesta a ${comment.user} en post ${activePost.value?.id}: ${comment.response}`);
  alert(`Respuesta enviada a ${comment.user}`);
  comment.isReplySent = true;
  activeCommentId.value = null; // Close the response editor
};

const getActiveComment = (postId: number, commentId: number) => {
  const post = mockPosts.value.find(p => p.id === postId);
  return post?.comments.find(c => c.id === commentId) || null;
};

const totalPendingComments = mockPosts.value.reduce((sum, post) => sum + post.comments.filter(c => !c.isReplySent).length, 0);
</script>

<template>
  <div class="grid grid-cols-3 gap-6 min-h-[80vh]">
    <!-- Left Panel: Post List -->
    <div class="col-span-1 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <h2 class="text-xl font-bold p-4 border-b bg-gray-50 text-gray-800">Posts con Comentarios Pendientes ({{ totalPendingComments }})</h2>
      <div class="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">
        <div
          v-for="post in mockPosts"
          :key="post.id"
          class="p-3 cursor-pointer hover:bg-indigo-50 transition-colors flex items-center gap-3"
          :class="{ 'bg-indigo-100 border-l-4 border-indigo-500': activePost?.id === post.id }"
          @click="selectPost(post)"
        >
          <img :src="post.thumbnailUrl" class="size-12 object-cover rounded-md border" alt="Post Thumbnail" />
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-gray-800 truncate">{{ post.caption }}</p>
            <span class="text-xs font-medium text-indigo-600">{{ post.platform }} | {{ post.comments.length }} Comentarios</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Panel: Comment Thread (Instagram Style) -->
    <div v-if="activePost" class="col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-200 flex flex-col">
      <h2 class="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Comentarios del Post</h2>

      <!-- Post Preview (Simplified) -->
      <div class="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <img :src="activePost.thumbnailUrl" class="size-16 object-cover rounded-md" alt="Post Thumbnail" />
        <p class="text-sm text-gray-700 italic truncate">{{ activePost.caption }}</p>
      </div>

      <!-- Comments List -->
      <div class="flex-1 space-y-6 overflow-y-auto max-h-[60vh] pr-2">
        <div v-for="comment in activePost.comments" :key="comment.id" class="flex items-start gap-3">
          <img src="/assets/account.svg" class="size-8 rounded-full flex-shrink-0" alt="User Avatar" />
          <div class="flex-1 min-w-0">
            <!-- Comment Bubble -->
            <div class="bg-gray-100 p-3 rounded-xl rounded-tl-none">
              <p class="font-semibold text-sm text-gray-900 inline mr-1">{{ comment.user }}</p>
              <p class="text-gray-700 inline">{{ comment.text }}</p>
            </div>
            
            <!-- Actions/Meta -->
            <div class="flex items-center gap-3 mt-1 text-xs text-gray-500 ml-1">
              <span>{{ comment.time }}</span>
              <button 
                v-if="!comment.isReplySent"
                @click="selectComment(comment)" 
                class="font-semibold hover:text-indigo-600 transition-colors"
              >
                Responder
              </button>
              <span v-else class="text-green-600 font-semibold">Respuesta Enviada</span>
            </div>

            <!-- AI Response Editor (Only visible if selected) -->
            <div v-if="activeCommentId === comment.id" class="mt-3 p-4 bg-white rounded-lg shadow-inner border border-indigo-200">
              <h3 class="font-semibold text-indigo-600 flex items-center gap-2 mb-2">
                <img class="size-4" src="/assets/gemini.svg" alt="AI Icon" />
                Sugerencia IA:
              </h3>
              <p class="text-sm text-gray-700 mb-3">{{ comment.suggestedResponse }}</p>

              <h3 class="font-semibold text-sm mb-1 text-gray-800">Tu Respuesta (Editable)</h3>
              <textarea
                v-model="comment.response"
                rows="3"
                class="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Edita la sugerencia de la IA o escribe tu propia respuesta..."
              ></textarea>
              <button
                @click="sendResponse(comment)"
                :disabled="!comment.response.trim()"
                class="mt-2 px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
              >
                Enviar Respuesta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="col-span-2 flex items-center justify-center text-gray-500 bg-white rounded-xl shadow-lg border border-gray-200">
      <p class="text-lg">Selecciona un post para ver sus comentarios.</p>
    </div>
  </div>
</template>