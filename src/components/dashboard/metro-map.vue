<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card/";

const loading = ref(true);
let timer: ReturnType<typeof setTimeout> | undefined;

onMounted(() => {
  // Simulate loading time
  timer = setTimeout(() => {
    loading.value = false;
  }, 1500);
});

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer);
});
</script>

<template>
  <Card class="col-span-2 animate-fade-in">
    <CardHeader class="pb-3">
      <CardTitle class="text-base font-medium">Metro Traffic Map</CardTitle>
    </CardHeader>
    <CardContent class="px-2 pt-0">
      <div class="relative overflow-hidden rounded-md h-[340px] flex items-center justify-center bg-muted/30">
        <div v-if="loading" class="animate-pulse">Loading map data...</div>
        <div v-else class="h-full w-full">
          <svg viewBox="0 0 400 300" class="h-full w-full">
            <!-- Metro lines -->
            <path d="M 50,50 L 350,50" stroke="#FF6B6B" stroke-width="4" fill="none" />
            <path d="M 50,100 L 350,100" stroke="#4ECDC4" stroke-width="4" fill="none" />
            <path d="M 50,150 L 180,150 L 180,250 L 350,250" stroke="#FFE66D" stroke-width="4" fill="none" />
            <path d="M 50,200 L 350,200" stroke="#1A535C" stroke-width="4" fill="none" />
            <path d="M 100,30 L 100,270" stroke="#7B68EE" stroke-width="4" fill="none" />
            <path d="M 200,30 L 200,270" stroke="#7B68EE" stroke-width="4" fill="none" />
            <path d="M 300,30 L 300,270" stroke="#7B68EE" stroke-width="4" fill="none" />
            
            <!-- Stations -->
            <circle cx="100" cy="50" r="6" fill="white" stroke="#FF6B6B" stroke-width="2" />
            <circle cx="200" cy="50" r="6" fill="white" stroke="#FF6B6B" stroke-width="2" />
            <circle cx="300" cy="50" r="6" fill="white" stroke="#FF6B6B" stroke-width="2" />
            
            <circle cx="100" cy="100" r="6" fill="white" stroke="#4ECDC4" stroke-width="2" />
            <circle cx="200" cy="100" r="6" fill="white" stroke="#4ECDC4" stroke-width="2" />
            <circle cx="300" cy="100" r="6" fill="white" stroke="#4ECDC4" stroke-width="2" />
            
            <circle cx="100" cy="150" r="6" fill="white" stroke="#FFE66D" stroke-width="2" />
            <circle cx="180" cy="150" r="6" fill="white" stroke="#FFE66D" stroke-width="2" />
            <circle cx="180" cy="250" r="6" fill="white" stroke="#FFE66D" stroke-width="2" />
            <circle cx="300" cy="250" r="6" fill="white" stroke="#FFE66D" stroke-width="2" />
            
            <circle cx="100" cy="200" r="6" fill="white" stroke="#1A535C" stroke-width="2" />
            <circle cx="200" cy="200" r="6" fill="white" stroke="#1A535C" stroke-width="2" />
            <circle cx="300" cy="200" r="6" fill="white" stroke="#1A535C" stroke-width="2" />
            
            <!-- Traffic indicators -->
            <circle cx="200" cy="100" r="8" fill="#FF6B6B" opacity="0.7" class="animate-pulse-slow" />
            <circle cx="300" cy="200" r="8" fill="#FF6B6B" opacity="0.7" class="animate-pulse-slow" />
          </svg>
        </div>
      </div>
      <div class="flex items-center justify-between mt-4 px-3 text-xs text-muted-foreground">
        <div class="flex items-center">
          <span class="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
          <span>Normal</span>
        </div>
        <div class="flex items-center">
          <span class="h-2 w-2 rounded-full bg-amber-500 mr-1"></span>
          <span>Moderate</span>
        </div>
        <div class="flex items-center">
          <span class="h-2 w-2 rounded-full bg-red-500 mr-1"></span>
          <span>Congested</span>
        </div>
      </div>
    </CardContent>
  </Card>
</template>