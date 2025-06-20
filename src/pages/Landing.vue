<!-- filepath: c:\Users\noure\Desktop\Etude\projet-annuel\front\src\pages\Landing.vue -->
<template>
    <div class="min-h-screen bg-background">
        <nav class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div class="container mx-auto flex h-16 items-center justify-between px-6">
                <div class="nav-brand">
                    <h2 class="text-2xl font-bold text-primary">EcoSense</h2>
                </div>
                <div class="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" @click="toggleTheme">
                        <Sun v-if="isDark" class="h-5 w-5" />
                        <Moon v-else class="h-5 w-5" />
                    </Button>
                    <Button variant="outline" as-child>
                        <router-link to="/auth">Sign In</router-link>
                    </Button>
                </div>
            </div>
        </nav>

        <header class="relative overflow-hidden bg-gradient-to-br from-primary to-blue-600 text-primary-foreground">
            <div class="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
            <div class="container mx-auto px-6 py-24 text-center relative">
                <div class="mx-auto max-w-4xl">
                    <h1 class="text-4xl font-bold tracking-tight sm:text-6xl mb-6 animate-fade-in">
                        Welcome to EcoSense
                    </h1>
                    <p class="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto animate-fade-in [animation-delay:200ms]">
                        Smart City Environmental Monitoring Platform
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in [animation-delay:400ms]">
                        <Button size="lg" variant="secondary" as-child>
                            <router-link to="/auth">Get Started</router-link>
                        </Button>
                        <Button size="lg" variant="secondary" @click="goToDashboard" class="border-primary-foreground/20 hover:bg-primary-foreground/10">
                            View Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    
        <section class="py-24 bg-background">
            <div class="container mx-auto px-6">
                <div class="text-center mb-16">
                    <h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                        Key Features
                    </h2>
                    <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Discover the powerful tools that make EcoSense the leading environmental monitoring platform
                    </p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card class="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slide-up">
                        <CardContent class="p-8 text-center">
                            <div class="text-5xl mb-6">🌍</div>
                            <h3 class="text-xl font-semibold text-primary mb-4">Environmental Monitoring</h3>
                            <p class="text-muted-foreground leading-relaxed">
                                Real-time air quality and pollution tracking with advanced sensors
                            </p>
                        </CardContent>
                    </Card>
                    <Card class="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slide-up [animation-delay:200ms]">
                        <CardContent class="p-8 text-center">
                            <div class="text-5xl mb-6">📊</div>
                            <h3 class="text-xl font-semibold text-primary mb-4">Smart Analytics</h3>
                            <p class="text-muted-foreground leading-relaxed">
                                Predictive insights and data-driven environmental forecasting
                            </p>
                        </CardContent>
                    </Card>
                    <Card class="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slide-up [animation-delay:400ms]">
                        <CardContent class="p-8 text-center">
                            <div class="text-5xl mb-6">🏙️</div>
                            <h3 class="text-xl font-semibold text-primary mb-4">City Dashboard</h3>
                            <p class="text-muted-foreground leading-relaxed">
                                Comprehensive overview of your smart city's environmental health
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>

        <footer class="bg-muted/30 border-t">
            <div class="container mx-auto px-6 py-8">
                <p class="text-center text-muted-foreground text-sm">
                    &copy; 2025 EcoSense. All rights reserved.
                </p>
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sun, Moon } from 'lucide-vue-next';

const router = useRouter();
const isDark = ref(false);

onMounted(() => {
    // Check current theme
    isDark.value = document.documentElement.classList.contains('dark');
});

const toggleTheme = () => {
    const newTheme = isDark.value ? 'light' : 'dark';
    isDark.value = !isDark.value;
    
    if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    
    // Store preference
    localStorage.setItem('theme', newTheme);
};

const goToDashboard = () => {
    const isAuthenticated = localStorage.getItem('token') !== null;
    
    if (isAuthenticated) {
        router.push('/dashboard');
    } else {
        router.push('/auth');
    }
};
</script>

<style scoped>
.bg-grid-white\/\[0\.05\] {
    background-image: radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
}
</style>