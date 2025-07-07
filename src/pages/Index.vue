<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/navbar.vue';
import PollutionIndicators from '@/components/dashboard/pollution-indicators.vue';
import AirQualityChart from '@/components/dashboard/air-quality-chart.vue';
import TrafficChart from '@/components/dashboard/traffic-chart.vue';
import WeatherWidget from '@/components/dashboard/weather-widget.vue';
import AlertFeed from '@/components/dashboard/alert-feed.vue';
import PredictionCard from '@/components/dashboard/prediction-card.vue';

const toast = useToast();
const cityName = ref('Smart City');
const isLoading = ref(true);
let timer = null;

onMounted(() => {
  // Simulate initial data loading
  timer = setTimeout(() => {
    isLoading.value = false;
    
    // Show welcome toast
    toast.toast({
      title: "Welcome to EcoSense",
      description: "Smart city environmental monitoring platform is ready.",
      duration: 5000,
    });
  }, 1500);
});

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer);
});

const formattedDate = () => {
  return new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};
</script>

<template>
  <div class="min-h-screen flex flex-col bg-background">
    <Navbar />
    
    <main class="flex-1 container px-4 py-6">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold animate-fade-in">
            {{ cityName }} Environmental Dashboard
          </h1>
          <p class="text-muted-foreground animate-fade-in [animation-delay:200ms]">
            Real-time monitoring and predictive analytics
          </p>
        </div>
        <div class="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary animate-fade-in">
          {{ formattedDate() }}
        </div>
      </div>

      <div v-if="isLoading" class="w-full h-[60vh] flex items-center justify-center">
        <div class="text-center">
          <div class="relative h-16 w-16 mx-auto mb-4">
            <div class="absolute inset-0 rounded-full bg-primary/20 animate-pulse-slow"></div>
            <div class="absolute inset-1 rounded-full bg-primary/30"></div>
            <div class="absolute inset-2 rounded-full bg-primary/40"></div>
            <div class="absolute inset-3 rounded-full bg-primary/50"></div>
            <div class="absolute inset-4 rounded-full bg-primary/60 animate-rotate-center"></div>
          </div>
          <p class="text-muted-foreground">Loading environmental data...</p>
        </div>
      </div>
      
      <div v-else class="space-y-8">
        <PollutionIndicators />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TrafficChart />
          <div class="md:col-span-2 grid grid-cols-1 gap-4">
            <AlertFeed />
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
          <AirQualityChart />
          <div class="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <WeatherWidget />
            <PredictionCard />
            <PredictionCard />
          </div>
        </div>
        
        
      </div>
    </main>
    
    <footer class="mt-auto border-t py-4">
      <div class="container text-center text-sm text-muted-foreground">
        <p>© 2025 EcoSense Smart Sinj City Platform. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>