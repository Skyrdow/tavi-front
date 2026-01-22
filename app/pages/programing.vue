<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useApi } from "~/composables/useApi";
import { useAuth } from "~/composables/useAuth";
import JobCard from "~/components/JobCard.vue";
import { Calendar, DatePicker } from "v-calendar";
import "v-calendar/style.css";
import { toast } from "vue3-toastify";

definePageMeta({
  middleware: "auth",
});

const { getJobsByTenantId, updateJob, deleteJob } = useApi();
const { token } = useAuth();

const disabledDates = ref([
  { end: new Date(Date.now() - 24 * 60 * 60 * 1000), start: null },
]);

const now = new Date();
const currentMonth = ref(now.getMonth());
const currentYear = ref(now.getFullYear());

const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

interface Job {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM (24h format)
  action: string;
  status: string;
  data: any;
}

const jobs = ref<Job[]>([]);
const selectedJob = ref<string | null>(null);
const isEditing = ref(false);
const newScheduledAt = ref(new Date());

const loadJobs = async () => {
  try {
    console.log("loadJobs called, token:", token.value);
    if (!token.value) {
      console.log("No token available");
      return;
    }
    const response = await getJobsByTenantId(token.value);
    console.log("Jobs response:", response);
    jobs.value = response.data.map((job: any) => {
      const scheduledAt = new Date(job.scheduledAt);
      const date = scheduledAt.toISOString().split("T")[0];
      const time = scheduledAt.toTimeString().slice(0, 5);
      return {
        id: job.id,
        date,
        time,
        action: job.action,
        status: job.status,
        data: job.data,
      };
    });
    toast.success("Jobs cargados correctamente.");
    console.log("Jobs loaded:", jobs.value);
  } catch (error) {
    toast.error("Error al cargar los jobs.");
    console.error("Error loading jobs:", error);
  }
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

onMounted(() => {
  if (token.value) loadJobs();
});

watch(token, (newToken) => {
  if (newToken) loadJobs();
});

const selectJob = (jobId: string) => {
  selectedJob.value = selectedJob.value === jobId ? null : jobId;
};

const editSelectedJob = () => {
  if (!selectedJob.value) return;
  const job = jobs.value.find((j) => j.id === selectedJob.value);
  if (!job) return;
  newScheduledAt.value = new Date(job.date + "T" + job.time);
  isEditing.value = true;
};

const confirmEdit = async () => {
  if (!token.value || !selectedJob.value) return;
  try {
    await updateJob(
      token.value,
      selectedJob.value,
      newScheduledAt.value.toISOString(),
    );
    isEditing.value = false;
    selectedJob.value = null;
    loadJobs();
    toast.success("Job actualizado correctamente.");
  } catch (error: any) {
    toast.error(
      "Error al editar el job: " +
        (error.data?.message || error.message || "Error desconocido"),
    );
    console.error("Error updating job:", error);
    const message = error.data?.message || error.message || "Error desconocido";
    // alert('Error al editar el job: ' + message);
  }
};

const deleteSelectedJob = async () => {
  if (!token.value || !selectedJob.value) return;
  if (!confirm("¿Eliminar el job seleccionado?")) return;
  try {
    await deleteJob(token.value, selectedJob.value);
    selectedJob.value = null;
    loadJobs();
    toast.success("Job eliminado correctamente.");
  } catch (error: any) {
    toast.error(
      "Error al eliminar el job: " +
        (error.data?.message || error.message || "Error desconocido"),
    );
    console.error("Error deleting job:", error);
    const message = error.data?.message || error.message || "Error desconocido";
    // alert('Error al eliminar el job: ' + message);
  }
};

const calendarDays = computed(() => {
  const date = new Date(currentYear.value, currentMonth.value, 1);
  const firstDayOfWeek = date.getDay(); // 0 for Sunday, 6 for Saturday
  const daysInMonth = new Date(
    currentYear.value,
    currentMonth.value + 1,
    0,
  ).getDate();

  const days = [];

  // Add leading empty days
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push({ day: null, dateString: null, jobs: [] });
  }

  // Add actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const monthPadded = String(currentMonth.value + 1).padStart(2, "0");
    const dayPadded = String(day).padStart(2, "0");
    const dateString = `${currentYear.value}-${monthPadded}-${dayPadded}`;

    let jobsForDay = jobs.value.filter((job) => job.date === dateString);

    // Sort jobs by time
    jobsForDay.sort((a, b) => a.time.localeCompare(b.time));

    days.push({ day, dateString, jobs: jobsForDay });
  }

  return days;
});

const monthName = computed(() => {
  return new Date(currentYear.value, currentMonth.value).toLocaleString(
    "es-ES",
    { month: "long", year: "numeric" },
  );
});
</script>

<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Programación de Jobs</h1>

    <!-- Calendar Header -->
    <div
      class="flex justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-lg border border-gray-100"
    >
      <button
        @click="prevMonth"
        class="text-2xl font-semibold text-indigo-500 hover:text-indigo-700 transition-colors"
      >
        &lt;
      </button>
      <h2 class="text-3xl font-extrabold capitalize text-gray-900">
        {{ monthName }}
      </h2>
      <button
        @click="nextMonth"
        class="text-2xl font-semibold text-indigo-500 hover:text-indigo-700 transition-colors"
      >
        &gt;
      </button>
    </div>

    <!-- Calendar Grid -->
    <div
      class="grid grid-cols-7 gap-px border border-gray-200 rounded-xl bg-gray-200 shadow-2xl overflow-hidden"
    >
      <!-- Days of Week Headers -->
      <div
        v-for="day in daysOfWeek"
        :key="day"
        class="text-center font-bold py-3 bg-indigo-600 text-white text-sm uppercase tracking-wider"
      >
        {{ day }}
      </div>

      <!-- Days of Month -->
      <div
        v-for="(day, index) in calendarDays"
        :key="index"
        class="min-h-40 p-2 bg-white overflow-hidden transition-colors duration-150"
        :class="{ 'bg-gray-100 text-gray-400': day.day === null }"
      >
        <div v-if="day.day !== null" class="flex flex-col h-full">
          <span
            class="text-lg font-bold mb-1 ml-1"
            :class="{ 'text-indigo-600': day.dateString === '2025-11-10' }"
            >{{ day.day }}</span
          >
          <div class="grow space-y-1 overflow-y-auto">
            <JobCard
              v-for="job in day.jobs"
              :key="job.id"
              :job="job"
              :selected-job="selectedJob"
              @select-job="selectJob"
            />
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div v-if="selectedJob" class="flex gap-4 mt-6 justify-center">
        <button
          @click="editSelectedJob"
          class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Editar Fecha
        </button>
        <button
          @click="deleteSelectedJob"
          class="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
        >
          Eliminar Job
        </button>
      </div>

      <!-- Edit Modal -->
      <div
        v-if="isEditing"
        class="fixed inset-0 bg-white bg-opacity-20 flex items-center justify-center z-50"
        @click="isEditing = false"
      >
        <div
          class="bg-white p-6 rounded-xl shadow-lg border border-gray-100 max-w-md w-full mx-4 relative"
          @click.stop
        >
          <button
            @click="isEditing = false"
            class="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h3 class="font-bold text-lg mb-4 text-gray-800 pr-8">
            Editar fecha de publicación
          </h3>
          <DatePicker
            v-model="newScheduledAt"
            mode="dateTime"
            is24hr
            :disabled-dates="disabledDates"
          />
          <div class="flex gap-2 mt-4">
            <button
              @click="confirmEdit"
              class="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Confirmar
            </button>
            <button
              @click="isEditing = false"
              class="flex-1 px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
