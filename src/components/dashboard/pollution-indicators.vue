<script setup lang="ts">
import { ref, onMounted } from 'vue';
import StatCard from "@/components/ui/stat-card.vue";
import { Cloud, Droplets, Waves, Factory, Thermometer } from "lucide-vue-next";

interface PollutionData {
  pm25: { value: number; trend: number };
  no2: { value: number; trend: number };
  o3: { value: number; trend: number };
  co2: { value: number; trend: number };
  temperature: { value: number; trend: number };
}

const data = ref<PollutionData | null>(null);
const loading = ref(true);

onMounted(() => {
  // Mock API call
  setTimeout(() => {
    data.value = {
      pm25: { value: 18.5, trend: -3.2 },
      no2: { value: 24.3, trend: 2.7 },
      o3: { value: 62.1, trend: -1.5 },
      co2: { value: 408, trend: 1.2 },
      temperature: { value: 22.7, trend: 0.8 },
    };
    loading.value = false;
  }, 1500);
});

const indicators = [
  {
    title: "PM2.5",
    getValue: () => data.value?.pm25.value ?? 0,
    getTrend: () => data.value?.pm25.trend ?? 0,
    icon: Droplets,
    unit: "μg/m³",
    description: "Fine particulate matter",
  },
  {
    title: "NO₂",
    getValue: () => data.value?.no2.value ?? 0,
    getTrend: () => data.value?.no2.trend ?? 0,
    icon: Cloud,
    unit: "μg/m³",
    description: "Nitrogen dioxide",
  },
  {
    title: "O₃",
    getValue: () => data.value?.o3.value ?? 0,
    getTrend: () => data.value?.o3.trend ?? 0,
    icon: Waves,
    unit: "μg/m³",
    description: "Ozone",
  },
  {
    title: "CO₂",
    getValue: () => data.value?.co2.value ?? 0,
    getTrend: () => data.value?.co2.trend ?? 0,
    icon: Factory,
    unit: "ppm",
    description: "Carbon dioxide",
  },
  {
    title: "Temperature",
    getValue: () => data.value?.temperature.value ?? 0,
    getTrend: () => data.value?.temperature.trend ?? 0,
    icon: Thermometer,
    unit: "°C",
    description: "Average city temperature",
  },
];
</script>

<template>
  <div v-if="loading" class="grid grid-cols-5 gap-4 animate-pulse">
    <div v-for="i in 5" :key="i" class="bg-card rounded-lg p-6 flex flex-col space-y-4">
      <div class="h-4 w-1/2 bg-muted rounded"></div>
      <div class="h-8 w-2/3 bg-muted rounded"></div>
      <div class="h-3 w-full bg-muted rounded"></div>
    </div>
  </div>
  
  <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
    <StatCard
      v-for="(indicator, index) in indicators"
      :key="index"
      :title="indicator.title"
      :value="`${indicator.getValue()} ${indicator.unit}`"
      :description="indicator.description"
      :icon="indicator.icon"
      :trend="{
        value: indicator.getTrend(),
        isPositive: indicator.title === 'Temperature' ? indicator.getTrend() < 0 : indicator.getTrend() < 0
      }"
      :class="`animate-slide-in`"
      :style="`animation-delay: ${index * 50}ms`"
    />
  </div>
</template>