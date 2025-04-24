<script setup>
import { ref } from 'vue';

const healthStatus = ref({
    app: 'EcoSense',
    status: 'ok',
    timestamp: new Date().toISOString(),
    dependencies: {
        api: 'reachable', // Simulate API health check
        database: 'connected', // Simulate database health check
    },
});
</script>

<template>
    <div>
        <h1>Health Check</h1>
        <pre>{{ healthStatus }}</pre>
    </div>
</template>