<!-- filepath: /c:/Users/Noureddine/Cours/ProjetAnnuel1/front-end/src/components/ui/StatCard.vue -->
<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  value: string | number;
  description?: string;
  icon?: any; // Vue equivalent of React.ReactNode
  trend?: {
    value: number;
    isPositive: boolean;
  };
  class?: string;
  valueClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  description: undefined,
  icon: undefined,
  trend: undefined,
  class: '',
  valueClass: ''
});
</script>

<template>
  <Card :class="cn('overflow-hidden transition-all duration-300', props.class)">
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle class="text-sm font-medium">{{ title }}</CardTitle>
      <div v-if="icon" class="h-4 w-4 text-muted-foreground">
        <component :is="icon" />
      </div>
    </CardHeader>
    <CardContent>
      <div class="text-2xl font-bold animate-fade-in">
        <span :class="cn(props.valueClass)">{{ value }}</span>
      </div>
      <p v-if="description" class="text-xs text-muted-foreground">{{ description }}</p>
      <div
        v-if="trend"
        :class="cn(
          'flex items-center text-xs mt-1',
          trend.isPositive ? 'text-green-500' : 'text-red-500'
        )"
      >
        {{ trend.isPositive ? "↑" : "↓" }} {{ Math.abs(trend.value) }}%
      </div>
    </CardContent>
  </Card>
</template>