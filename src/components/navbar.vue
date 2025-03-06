<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { LayoutDashboard, Map, Bell, Settings, Sun, Moon, Menu, X } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/user-mobile';

defineOptions({
  name: 'Navbar'
});

const theme = ref('light');
const notificationCount = ref(3);
const isMobile = useIsMobile();

onMounted(() => {
  // Check if user prefers dark mode
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    theme.value = 'light';
    document.documentElement.classList.add('light');
  }
});

const toggleTheme = () => {
  const newTheme = theme.value === 'light' ? 'dark' : 'light';
  theme.value = newTheme;
  
  if (newTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

const navLinks = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'City Map', href: '/map', icon: Map },
  { name: 'Settings', href: '/settings', icon: Settings },
];
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="container flex h-16 items-center justify-between">
      <div class="flex items-center">
        <RouterLink to="/" class="flex items-center">
          <div class="relative mr-4 h-8 w-8">
            <div class="absolute inset-0 rounded-full bg-primary/20 animate-pulse-slow"></div>
            <div class="absolute inset-1 rounded-full bg-primary/40"></div>
            <div class="absolute inset-2 rounded-full bg-primary/60"></div>
            <div class="absolute inset-3 rounded-full bg-primary/80"></div>
            <div class="absolute inset-[14px] rounded-full bg-primary"></div>
          </div>
          <span class="font-semibold text-xl">EcoSense</span>
        </RouterLink>
        
        <nav v-if="!isMobile" class="ml-8 hidden md:flex items-center space-x-6">
          <RouterLink
            v-for="link in navLinks"
            :key="link.name"
            :to="link.href"
            class="flex items-center text-sm font-medium transition-colors hover:text-primary"
          >
            <component :is="link.icon" class="h-4 w-4 mr-2" />
            {{ link.name }}
          </RouterLink>
        </nav>
      </div>
      
      <div class="flex items-center space-x-3">
        <Button variant="ghost" size="icon" class="relative" as-child>
          <RouterLink to="/notifications">
            <Bell class="h-5 w-5" />
            <span v-if="notificationCount > 0" class="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {{ notificationCount }}
            </span>
          </RouterLink>
        </Button>
        
        <Button variant="ghost" size="icon" @click="toggleTheme">
          <Sun v-if="theme === 'dark'" class="h-5 w-5" />
          <Moon v-else class="h-5 w-5 w-b" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline" class="rounded-full h-8 w-8 p-0">
              <span class="sr-only">Open user menu</span>
              <div class="rounded-full bg-primary/10 h-full w-full flex items-center justify-center text-sm font-semibold">
                A
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="min-w-[160px]">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Sheet v-if="isMobile">
          <SheetTrigger as-child>
            <Button variant="ghost" size="icon">
              <Menu class="h-5 w-5" />
              <span class="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" class="w-[80%] sm:w-[350px]">
            <div class="px-2 py-6">
              <h2 class="text-lg font-semibold mb-6">Menu</h2>
              <nav class="flex flex-col space-y-4">
                <RouterLink
                  v-for="link in navLinks"
                  :key="link.name"
                  :to="link.href"
                  class="flex items-center px-2 py-2 rounded-md hover:bg-muted text-sm font-medium"
                >
                  <component :is="link.icon" class="h-4 w-4 mr-2" />
                  {{ link.name }}
                </RouterLink>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  </header>
</template>