<!-- filepath: /c:/Users/Noureddine/Cours/ProjetAnnuel1/front-end/src/components/dashboard/weather-widget.vue -->
<script setup lang="ts">
import { ref, onMounted, h } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, CloudRain, Sun, Wind } from "lucide-vue-next";

type WeatherType = "sunny" | "cloudy" | "rainy" | "windy";

interface WeatherData {
  type: WeatherType;
  temperature: number;
  humidity: number;
  windSpeed: number;
}

const weather = ref<WeatherData | null>(null);
const loading = ref(true);

onMounted(() => {
  // Mock API call
  setTimeout(() => {
    weather.value = {
      type: "cloudy",
      temperature: 22,
      humidity: 65,
      windSpeed: 12,
    };
    loading.value = false;
  }, 1200);
});

const renderWeatherIcon = (type: WeatherType, size = 24) => {
  switch (type) {
    case "sunny":
      return h(Sun, { size, class: "text-amber-400" });
    case "cloudy":
      return h(Cloud, { size, class: "text-gray-400" });
    case "rainy":
      return h(CloudRain, { size, class: "text-blue-400" });
    case "windy":
      return h(Wind, { size, class: "text-gray-400" });
    default:
      return h(Cloud, { size });
  }
};
</script>

<template>
  <Card class="animate-fade-i justify-center items-center flex flex-col">
    <CardHeader class="pb-2">
      <CardTitle class="text-base font-medium">Weather</CardTitle>
    </CardHeader>
    <CardContent>
      <div v-if="loading" class="flex flex-col space-y-4 animate-pulse">
        <div class="flex items-center justify-center h-20">
          <div class="h-16 w-16 rounded-full bg-muted"></div>
        </div>
        <div class="h-4 w-24 mx-auto rounded bg-muted"></div>
        <div class="grid grid-cols-4 gap-2">
          <div class="h-10 rounded bg-muted"></div>
          <div class="h-10 rounded bg-muted"></div>
          <div class="h-10 rounded bg-muted"></div>
          <div class="h-10 rounded bg-muted"></div>
        </div>
      </div>
      <div v-else class="flex flex-col items-center animate-fade-in">
        <div class="flex items-center justify-center my-2">
          <component :is="renderWeatherIcon(weather?.type || 'cloudy', 48)" />
        </div>
        <div class="text-3xl font-bold mb-2">{{ weather?.temperature }}°C</div>
        <div class="grid grid-cols-1 gap-2 w-full text-sm">
          <div class="flex items-center justify-between gap-2">
            <span class="text-muted-foreground">Humidity</span>
            <span class="font-medium">{{ weather?.humidity }}%</span>
          </div>
          <div class="flex items-center justify-between gap-2">
            <span class="text-muted-foreground">Wind</span>
            <span class="font-medium">{{ weather?.windSpeed }} km/h</span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>