<script setup>
import { ref, watch, onMounted } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart } from "@/components/ui/chart-line";
import axios from 'axios';
import { toast } from 'vue-sonner';

const timeRanges = {
  "24h": { days: 24, label: "hours", base: 75, variance: 30 },
  "7d": { days: 7, label: "days", base: 70, variance: 20 },
  "31d": { days: 31, label: "days", base: 65, variance: 40 },
};

const convertTimeToHours = (time) => {
  const date = new Date(time);
  // gets the hour of the day in UTC
  const hours = date.getUTCHours();
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1; // Months are zero-based in JavaScript
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year} ${hours}:00`;
};

const formatLabel = (value, range) => {
  const { label } = timeRanges[range];
  if (label === "hours") {
    return `${convertTimeToHours(value)}`;
  }
  return `Day ${value + 1}`;
};

const selectedRange = ref("24h");
const data = ref([]);
const dataFiltered = ref([]);
const loading = ref(true);

const loadData = async () => {
  loading.value = true;
  await axios.get(`/api/aq/last-month/`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
  .then(response => {
    data.value = response.data.map(item => ({
      time: formatLabel(item.datetime, selectedRange.value),
      value: item.aqi
    }));
    dataFiltered.value = data.value.slice(-24); // Default to last 24 hours
    loading.value = false;
  })
  .catch(error => {
    console.error("Error fetching AQI data:", error);
    toast({
      title: "Error",
      description: "Failed to load AQI data. Please try again later.",
      variant: "destructive"
    })
  });
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
  switch (selectedRange.value) {
    case "24h":
      dataFiltered.value = data.value.slice(-24);
      break;
    case "7d":
      dataFiltered.value = data.value.slice(-7 * 24);
      break;
    case "31d":
      dataFiltered.value = data.value;
      break;
    default:
      break;
  }
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
      <CardTitle class="text-base font-medium">Air Quality Index (AQI)</CardTitle>
      <Tabs :default-value="selectedRange" class="w-[180px]" @update:modelValue="handleRangeChange">
        <TabsList class="grid w-full grid-cols-3">
          <TabsTrigger value="24h">24h</TabsTrigger>
          <TabsTrigger value="7d">7d</TabsTrigger>
          <TabsTrigger value="31d">31d</TabsTrigger>
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
            :data="dataFiltered"
            :categories="['value']"
            :colors="['#646cff']"
            index="time"
            :y-axis-width="60"
            :max-value="5"
            :show-x-axis="true"
            :show-y-axis="true"
            :show-tooltip="true"
            :show-grid-line="true"
            :x-formatter="(v) => v"
            :y-formatter="(v) => v"
            class="h-full"
          />
        </div>
      </template>
    </CardContent>
  </Card>
</template>