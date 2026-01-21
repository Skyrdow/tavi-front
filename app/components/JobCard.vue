<template>
  <div @click="selectJob" class="flex items-center gap-2 p-1 bg-indigo-50 rounded-lg cursor-pointer border border-indigo-300 hover:border-indigo-500 hover:shadow-md transition-all" :class="{ 'bg-indigo-100 border-indigo-500': selectedJob === job.id }">
    <div class="size-8 bg-indigo-200 rounded-md flex-shrink-0 flex items-center justify-center">
      <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    </div>
    <div class="flex flex-col min-w-0 flex-1">
      <span class="text-xs font-semibold text-indigo-800">{{ job.time }}</span>
      <span class="text-xs text-indigo-600 truncate">{{ job.action }}</span>
      <span class="text-xs text-gray-500 truncate">{{ job.status }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  job: {
    id: string;
    date: string;
    time: string;
    action: string;
    status: string;
    data: any;
  };
  selectedJob: string | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{ selectJob: [jobId: string] }>();

const selectJob = () => {
  emit('selectJob', props.job.id);
};
</script>