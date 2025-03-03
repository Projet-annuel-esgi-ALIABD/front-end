<script setup>
import TooltipProvider from './components/ui/tooltip/TooltipProvider.vue';
import Toaster from './components/ui/toast/Toaster.vue';
import Sonner from './components/ui/sonner/Sonner.vue';
</script>

<template>
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <router-view />
  </TooltipProvider>
</template>