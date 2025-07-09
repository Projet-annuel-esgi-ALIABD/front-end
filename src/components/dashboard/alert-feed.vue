<!-- filepath: /c:/Users/Noureddine/Cours/ProjetAnnuel1/front-end/src/components/dashboard/AlertFeed.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, Info, AlertCircle } from "lucide-vue-next";
import axios from 'axios';
import environment from '@/environment/environment';

interface Alert {
  id: number;
  type: "info" | "warning" | "critical";
  message: string;
  time: string;
}

const alerts = ref<Alert[]>([]);
const loading = ref(true);

onMounted(async () => {
  loading.value = true;
  await axios.get(`${environment.apiUrl}/api/alerte/`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }).then(response => {
    const data = response.data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    data.map((item: any) => {
      alerts.value.push({
        id: item.id,
        type: item.alert_type,
        message: item.message,
        time: getTimeAgo(item.created_at)
      });
    });
    loading.value = false;
  }).catch(error => {
    console.error("Error fetching alerts:", error);
    loading.value = false;
  });
});

const getTimeAgo = (time: string | number | Date) => {
  const now = new Date();
  const alertTime = new Date(time);
  const diffInSeconds = Math.floor((now.getTime() - alertTime.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minutes ago`;
  } else {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hours ago`;
  }
}

const getAlertIcon = (type: string) => {
  switch (type) {
    case "info":
      return Info;
    case "warning":
      return AlertCircle;
    case "critical":
      return AlertTriangle;
    default:
      return Info;
  }
};

const getIconClass = (type: string) => {
  switch (type) {
    case "info":
      return "h-4 w-4 text-blue-500";
    case "warning":
      return "h-4 w-4 text-amber-500";
    case "critical":
      return "h-4 w-4 text-red-500";
    default:
      return "h-4 w-4";
  }
};

const getBadgeVariant = (type: string) => {
  switch (type) {
    case "info":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "warning":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
    case "critical":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "";
  }
};
</script>

<template>
  <Card class="col-span-2 animate-fade-in">
    <CardHeader class="pb-2 flex flex-row items-center justify-between">
      <CardTitle class="text-base font-medium">Recent Alerts</CardTitle>
      <Bell class="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent class="p-0">
      <div v-if="loading" class="flex flex-col space-y-4 p-6 animate-pulse">
        <div v-for="i in 4" :key="i" class="flex items-start space-x-4">
          <div class="h-4 w-4 mt-1 rounded bg-muted"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 rounded bg-muted"></div>
            <div class="h-3 rounded bg-muted w-3/4"></div>
          </div>
        </div>
      </div>
      <ul v-else class="divide-y animate-fade-in">
        <li 
          v-for="alert in alerts" 
          :key="alert.id" 
          class="flex items-start p-4 space-x-3 transition-colors hover:bg-muted/30"
        >
          <div class="mt-0.5">
            <component :is="getAlertIcon(alert.type)" :class="getIconClass(alert.type)" />
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between mb-1">
              <h4 class="text-sm font-medium">{{ alert.message }}</h4>
              <Badge variant="outline" :class="getBadgeVariant(alert.type)">
                {{ alert.type }}
              </Badge>
            </div>
            <div class="flex items-center justify-between text-xs text-muted-foreground">
              <span>{{ alert.time }}</span>
            </div>
          </div>
        </li>
      </ul>
    </CardContent>
  </Card>
</template>