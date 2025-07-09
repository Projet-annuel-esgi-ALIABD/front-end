<!-- filepath: /c:/Users/Noureddine/Cours/ProjetAnnuel1/front-end/src/components/dashboard/weather-widget.vue -->
<script setup lang="ts">
import { ref, onMounted, h } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, CloudRain, Sun, Wind } from "lucide-vue-next";
import environment from "@/environment/environment.ts";
import axios from "axios";

type WeatherType = "sunny" | "cloudy" | "rainy" | "windy";

interface WeatherData {
  location?: string;
  type?: WeatherType;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
}

const mapWeatherType = (main: string): WeatherType => {
  switch (main) {
    case "Clear":
      return "sunny";
    case "Clouds":
      return "cloudy";
    case "Rain":
    case "Drizzle":
    case "Thunderstorm":
      return "rainy";
    case "Wind":
      return "windy";
    default:
      return "cloudy";
  }
};

const weather = ref<WeatherData | null>(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await axios.get(`${environment.apiUrl}/api/weather/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    const mainWeather = response.data.weather?.[0]?.main || "";
    weather.value = {
      location: response.data.name,
      type: mapWeatherType(mainWeather),
      temperature: response.data['main'].temp.toFixed(1),
      feelsLike: response.data['main'].feels_like.toFixed(1),
      humidity: response.data['main'].humidity,
      windSpeed: response.data['wind'].speed,
    };
    loading.value = false;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    loading.value = false;
  }
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
      <CardTitle class="text-2xl font-bold">{{ weather?.location }}</CardTitle>
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
            <span class="text-muted-foreground">Feels like</span>
            <span class="font-medium">{{ weather?.feelsLike }}°C</span>
          </div>
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