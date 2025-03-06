<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BarChart from "@/components/ui/chart-bar/BarChart.vue"; // This path is incorrect

// Your data generation code
const generateTrafficData = (hours: number) => {
  const data = [];
  const now = new Date();
  const currentHour = now.getHours();
  
  for (let i = 0; i < hours; i++) {
    const hour = (currentHour - (hours - 1) + i + 24) % 24;
    
    // Create vehicle volume data based on time of day
    let vehicleVolume = 0;
    if (hour >= 7 && hour <= 9) {
      // Morning rush hour
      vehicleVolume = 800 + Math.random() * 400;
    } else if (hour >= 16 && hour <= 18) {
      // Evening rush hour
      vehicleVolume = 750 + Math.random() * 450;
    } else if (hour >= 10 && hour <= 15) {
      // Midday
      vehicleVolume = 400 + Math.random() * 300;
    } else {
      // Night
      vehicleVolume = 150 + Math.random() * 200;
    }
    
    // Add congestion levels
    const congestionScore = vehicleVolume / 12;
    
    const isPrediction = i > (hours - 3);
    
    data.push({
      hour: `${hour}:00`,
      vehicles: Math.round(vehicleVolume),
      congestion: Math.round(congestionScore),
      isPrediction
    });
  }
  
  return data;
};

const timeRange = ref<"12h" | "24h">("12h");
const data = ref<any[]>([]);
const loading = ref(true);

const loadData = () => {
  loading.value = true;
  // Simulate API call with delay
  setTimeout(() => {
    data.value = generateTrafficData(timeRange.value === "12h" ? 12 : 24);
    loading.value = false;
  }, 1500);
};

onMounted(() => {
  loadData();
});

watch(timeRange, () => {
  loadData();
});
</script>

<template>
  <Card class="col-span-3 animate-fade-in">
    <CardHeader class="flex flex-row items-center justify-between pb-2">
      <CardTitle class="text-base font-medium">Traffic Flow</CardTitle>
      <Tabs :default-value="timeRange" class="w-[150px]" @value-change="(value: '12h' | '24h') => timeRange = value">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="12h">12h</TabsTrigger>
          <TabsTrigger value="24h">24h</TabsTrigger>
        </TabsList>
      </Tabs>
    </CardHeader>
    <CardContent class="pt-0">
      <div v-if="loading" class="h-[300px] flex items-center justify-center">
        <div class="animate-pulse text-sm text-muted-foreground">Loading traffic data...</div>
      </div>
      <template v-else>
        <div class="h-[300px]">
          <!-- Use your Vue-native BarChart component -->
          <BarChart
            :data="data"
            :categories="['vehicles', 'congestion']"
            index="hour"
            type="grouped"
            class="h-[300px]"
          />
        </div>
      </template>
    </CardContent>
  </Card>
</template>