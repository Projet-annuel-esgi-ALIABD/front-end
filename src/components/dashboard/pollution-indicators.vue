<script setup lang="ts">
import { ref, onMounted } from 'vue';
import StatCard from "@/components/ui/stat-card.vue";
import { Cloud, Droplets, Waves, Factory, Thermometer } from "lucide-vue-next";
import axios from 'axios';

interface PollutionData {
  pm2_5: { value: number; trend: number };
  no: { value: number; trend: number };
  no2: { value: number; trend: number };
  o3: { value: number; trend: number };
  co: { value: number; trend: number };
  so2: { value: number; trend: number };
  nh3: { value: number; trend: number };
  pm10: { value: number; trend: number };
  temperature: { value: number; trend: number };
}

const data = ref<PollutionData | null>(null);
const loading = ref(true);

onMounted(async () => {
  // Simulate data fetching
  await axios.get('/api/aq/last-10h/', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
    .then(response => {
      console.log("Fetched pollution data:", response.data.slice(-1)[0].components);
      const components = response.data.slice(-1)[0].components;
      const last_hour_components = response.data.slice(-2)[0].components || {};
      data.value = {
        pm2_5: { value: components.pm2_5, trend: last_hour_components.pm2_5 ? parseFloat((components.pm2_5 - last_hour_components.pm2_5).toFixed(2)) : 0 },
        no2: { value: components.no2, trend: last_hour_components.no2 ? parseFloat((components.no2 - last_hour_components.no2).toFixed(2)) : 0 },
        o3: { value: components.o3, trend: last_hour_components.o3 ? parseFloat((components.o3 - last_hour_components.o3).toFixed(2)) : 0 },
        co: { value: components.co, trend: last_hour_components.co ? parseFloat((components.co - last_hour_components.co).toFixed(2)) : 0 },
        temperature: { value: components.temperature, trend: last_hour_components.temperature ? parseFloat((components.temperature - last_hour_components.temperature).toFixed(2)) : 0 },
        no: { value: components.no, trend: last_hour_components.no ? parseFloat((components.no - last_hour_components.no).toFixed(2)) : 0 },
        so2: { value: components.so2, trend: last_hour_components.so2 ? parseFloat((components.so2 - last_hour_components.so2).toFixed(2)) : 0 },
        nh3: { value: components.nh3, trend: last_hour_components.nh3 ? parseFloat((components.nh3 - last_hour_components.nh3).toFixed(2)) : 0 },
        pm10: { value: components.pm10, trend: last_hour_components.pm10 ? parseFloat((components.pm10 - last_hour_components.pm10).toFixed(2)) : 0 },
      }
      console.log("Pollution data:", data.value);
      loading.value = false;
    })
    .catch(error => {
      console.error("Error fetching pollution data:", error);
      loading.value = false;
    });
});

const indicators = [
  {
    title: "PM2.5",
    getValue: () => data.value?.pm2_5.value ?? 0,
    getTrend: () => data.value?.pm2_5.trend ?? 0,
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
    getValue: () => data.value?.co.value ?? 0,
    getTrend: () => data.value?.co.trend ?? 0,
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
        isPositive: indicator.title === 'Temperature' ? indicator.getTrend() <= 0 : indicator.getTrend() <= 0
      }"
      :class="`animate-slide-in`"
      :style="`animation-delay: ${index * 50}ms`"
    />
  </div>
</template>