import { defineStore } from "pinia";

export const useContentStore = defineStore(
  "content",
  () => {
    const description = ref("");
    const mediaUrl = ref<string | null>(null);
    const scheduledDate = ref<Date | null>(null);

    const setMediaUrl = (url: string | null) => {
      mediaUrl.value = url;
    };

    return {
      description,
      mediaUrl,
      scheduledDate,
      setMediaUrl,
    };
  },
  {
    persist: true,
  },
);
