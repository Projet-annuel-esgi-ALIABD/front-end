<!-- filepath: /c:/Users/Noureddine/Cours/ProjetAnnuel1/front-end/src/components/dashboard/PredictionCard.vue -->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Zap } from "lucide-vue-next";

interface Prediction {
  id: number;
  type: string;
  title: string;
  description: string;
  probability: number;
  impact: "low" | "moderate" | "high";
  timeframe: string;
}

const prediction = ref<Prediction | null>(null);
const loading = ref(true);

onMounted(() => {
  // Mock API call
  setTimeout(() => {
    prediction.value = {
      id: 1,
      type: "air_quality",
      title: "Air Quality Alert",
      description: "Our AI predicts a significant decrease in air quality in the next 48 hours due to changing weather patterns and industrial activity.",
      probability: 87,
      impact: "high",
      timeframe: "Next 48 hours",
    };
    loading.value = false;
  }, 2000);
});

const getImpactColor = (impact: string) => {
  switch (impact) {
    case "low":
      return "text-green-500";
    case "moderate":
      return "text-amber-500";
    case "high":
      return "text-red-500";
    default:
      return "text-muted-foreground";
  }
};
</script>

<template>
  <Card class="animate-fade-in">
    <CardHeader class="pb-2">
      <div class="flex items-center justify-between">
        <CardTitle class="text-base font-medium">AI Prediction</CardTitle>
        <Sparkles class="h-4 w-4 text-amber-400" />
      </div>
    </CardHeader>
    <CardContent>
      <div v-if="loading" class="animate-pulse space-y-3">
        <div class="h-5 bg-muted rounded w-4/5"></div>
        <div class="h-20 bg-muted rounded"></div>
        <div class="flex justify-between mt-4">
          <div class="h-4 bg-muted rounded w-1/4"></div>
          <div class="h-4 bg-muted rounded w-1/4"></div>
        </div>
      </div>
      <template v-else>
        <h3 class="text-lg font-semibold mb-2">
          {{ prediction?.title }}
        </h3>
        <p class="text-sm text-muted-foreground mb-4">
          {{ prediction?.description }}
        </p>
        <div class="flex items-center justify-between text-sm">
          <div class="flex flex-col">
            <span class="text-muted-foreground">Probability</span>
            <span class="font-medium flex items-center">
              <Zap class="h-3 w-3 mr-1 text-amber-400" />
              {{ prediction?.probability }}%
            </span>
          </div>
          <div class="flex flex-col items-end">
            <span class="text-muted-foreground">Impact</span>
            <span :class="`font-medium ${getImpactColor(prediction?.impact || '')}`">
              {{ prediction?.impact?.charAt(0).toUpperCase() }}{{ prediction?.impact?.slice(1) }}
            </span>
          </div>
        </div>
        <div class="mt-3 pt-3 border-t text-xs text-muted-foreground">
          Predicted timeframe: {{ prediction?.timeframe }}
        </div>
      </template>
    </CardContent>
  </Card>
</template>