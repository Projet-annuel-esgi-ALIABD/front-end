<!-- filepath: /c:/Users/Noureddine/Cours/ProjetAnnuel1/front-end/src/components/dashboard/PredictionCard.vue -->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Zap } from "lucide-vue-next";
import axios from "axios";
import environment from "@/environment/environment";

interface Prediction {
  type: string;
  title: string;
  description: string;
  probability: number;
  timeframe: string;
}

const prediction = ref<Prediction | null>(null);
const loading = ref(true);

const getDescription = (highestProbability: number, highestIndex: number) => {
  let message = "Our AI predicts the following air quality probabilities for the next hour:";

  const probabilities = [
    "Very good",
    "Good",
    "Moderate",
    "Insufficient",
    "Bad"
  ];

  message += `\n- ${probabilities[highestIndex]} with a probability of ${Math.round(highestProbability * 100)}%.`;
  message += "\n\nThis means that the air quality index is expected to be " + (highestIndex + 1) + ".";
  message += "\n\nPlease take necessary precautions if you are sensitive to air quality issues.";

  return message;
};

onMounted(async () => {
  await axios.get(`${environment.apiUrl}/api/predict/air-quality/`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  })
  .then(response => {

    // Get highest probability and corresponding index from response.Data.aq_probabilities
    const highestProbability = Math.max(...response.data.aq_probabilities);
    const highestIndex = response.data.aq_probabilities.indexOf(highestProbability);

    prediction.value = {
      type: "air_quality",
      title: "Air Quality Alert",
      description: getDescription(highestProbability, highestIndex),
      probability: Math.round(highestProbability * 100), // Convert to percentage
      timeframe: "Next hour",
    }
    loading.value = false;
  })
  .catch(error => {
    console.error("Error fetching prediction:", error);
    loading.value = false;
  });
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
        <div class="flex items-center justify-center text-sm">
          <div class="flex flex-col items-center">
            <span class="text-muted-foreground">Probability</span>
            <span class="font-medium flex items-center">
              <Zap class="h-3 w-3 mr-1 text-amber-400" />
              {{ prediction?.probability }}%
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