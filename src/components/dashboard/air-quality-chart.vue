<script setup>
import { ref, watch, onMounted } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart } from "@/components/ui/chart-line";

// Mock data for AQI
const generateAQIData = (days, base, variance) => {
  const data = [];
  let value = base;
  
  for (let i = 0; i < days; i++) {
    const fluctuation = Math.random() * variance - variance / 2;
    value = Math.max(0, Math.min(500, value + fluctuation));
    
    data.push({
      time: i,
      value: Math.round(value),
      forecast: i >= days - 3 ? Math.round(value) : null,
    });
  }
  
  return data;
};

const timeRanges = {
  "24h": { days: 24, label: "hours", base: 75, variance: 30 },
  "7d": { days: 7, label: "days", base: 70, variance: 20 },
  "30d": { days: 30, label: "days", base: 65, variance: 40 },
};

const formatLabel = (value, range) => {
  const { label } = timeRanges[range];
  if (label === "hours") {
    return `${value}:00`;
  }
  return `Day ${value + 1}`;
};

const selectedRange = ref("24h");
const data = ref([]);
const loading = ref(true);

const loadData = () => {
  loading.value = true;
  setTimeout(() => {
    // Generate mock data based on selectedRange
    const now = new Date();
    const points = timeRanges[selectedRange.value].days;
    
    data.value = Array(points).fill(0).map((_, i) => {
      // Create your data point format that matches the LineChart component
      return {
        time: selectedRange.value === "24h" ? `${i}:00` : `Day ${i+1}`,
        value: Math.floor(Math.random() * 150) + 20
      };
    });
    loading.value = false;
  }, 1500);
};

const getAQIColor = (value) => {
  if (value <= 50) return "#00E400"; // Good
  if (value <= 100) return "#FFFF00"; // Moderate
  if (value <= 150) return "#FF7E00"; // Unhealthy for Sensitive Groups
  if (value <= 200) return "#FF0000"; // Unhealthy
  if (value <= 300) return "#99004C"; // Very Unhealthy
  return "#7E0023"; // Hazardous
};

const handleRangeChange = (value) => {
  selectedRange.value = value;
};

// Watch for changes to selectedRange and reload data
watch(selectedRange, () => {
  loadData();
});

// Load initial data
onMounted(() => {
  loadData();
});

// Computed properties
const latestValue = () => data.value.length > 0 ? data.value[data.value.length - 4]?.value : 0;
const aqiColor = () => getAQIColor(latestValue());
</script>

<template>
  <Card class="col-span-3 animate-fade-in">
    <CardHeader class="flex flex-row items-center justify-between pb-2">
      <CardTitle class="text-base font-medium">Air Quality Index</CardTitle>
      <Tabs :default-value="selectedRange" class="w-[180px]" @value-change="handleRangeChange">
        <TabsList class="grid w-full grid-cols-3">
          <TabsTrigger value="24h">24h</TabsTrigger>
          <TabsTrigger value="7d">7d</TabsTrigger>
          <TabsTrigger value="30d">30d</TabsTrigger>
        </TabsList>
      </Tabs>
    </CardHeader>
    <CardContent class="pt-0">
      <div v-if="loading" class="h-[300px] flex items-center justify-center">
        <div class="animate-pulse text-sm text-muted-foreground">Loading chart data...</div>
      </div>
      <template v-else>
        <div class="h-[300px]">
          <LineChart
            :data="data"
            :categories="['value']"
            :colors="['#646cff']"
            index="time"
            class="h-full"
          />
        </div>
      </template>
    </CardContent>
  </Card>
</template>