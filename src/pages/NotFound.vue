<script setup>
import { onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-vue-next';

const route = useRoute();

onMounted(() => {
  console.error(
    "404 Error: User attempted to access non-existent route:",
    route.path
  );
});
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-background">
    <div class="text-center max-w-md px-6 animate-scale-in">
      <div class="flex justify-center mb-6">
        <div class="h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <AlertCircle class="h-10 w-10 text-red-600 dark:text-red-400" />
        </div>
      </div>
      <h1 class="text-4xl md:text-5xl font-bold mb-4">404</h1>
      <p class="text-xl text-muted-foreground mb-8">
        Oops! The page you're looking for doesn't exist in our smart city.
      </p>
      <Button as-child class="animate-slide-up [animation-delay:300ms]">
        <RouterLink to="/">Return to Dashboard</RouterLink>
      </Button>
    </div>
  </div>
</template>