<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { LayoutDashboard, Map, Bell, Settings, Sun, Moon, Menu, X, LogOut, User } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/user-mobile';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

defineOptions({
  name: 'Navbar'
});

const router = useRouter();
const { toast } = useToast();
const theme = ref('light');
const notificationCount = ref(3);
const isMobile = useIsMobile();
const isAuthenticated = ref(localStorage.getItem('token') !== null && localStorage.getItem('token') !== 'null' && localStorage.getItem('token') !== undefined);
const userInitial = ref('U'); // Default initial

onMounted(async () => {
  // Check if user prefers dark mode
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    theme.value = 'light';
    document.documentElement.classList.add('light');
  }

  await getUserInitial().then(initial => {
    userInitial.value = initial;
  }).catch(error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth';
    } else {
      console.error("Error fetching user initial:", error);
    }
  });

  // For demo purposes - check if user is logged in (would normally be handled by an auth service)
  isAuthenticated.value = (localStorage.getItem('token') !== null && localStorage.getItem('token') !== 'null' && localStorage.getItem('token') !== undefined);
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
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
];

const logout = () => {
  // Here you would call your auth service logout method
  
  // For demo purposes
  localStorage.removeItem('token');
  isAuthenticated.value = false;
  
  toast({
    title: "Logged out successfully",
    description: "You have been logged out of your account",
  });
  
  router.push('/auth');
};

const getUserInitial = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/auth';
  }
  return await axios.get(`${environment.apiUrl}/api/user/`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(response => {
    const user = response.data;
    return user.first_name ? user.first_name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase();
  }).catch(error => {
    console.error("Error fetching user data:", error);
    return 'U'; // Fallback initial
  });
};
</script>

<template>
  <header class="min-w-[700px] md:grid-cols-6 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
        
        <nav v-if="!isMobile && isAuthenticated" class="ml-8 hidden md:flex items-center space-x-6">
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
        <Button v-if="!isAuthenticated" variant="outline" size="sm" as-child>
          <RouterLink to="/auth">Log in / Register</RouterLink>
        </Button>
        
        <Button variant="ghost" size="icon" @click="toggleTheme">
          <Sun v-if="theme === 'dark'" class="h-5 w-5" />
          <Moon v-else class="h-5 w-5 w-b" />
        </Button>
        
        <DropdownMenu v-if="isAuthenticated">
          <DropdownMenuTrigger as-child>
            <Button variant="outline" class="rounded-full h-8 w-8 p-0">
              <span class="sr-only">Open user menu</span>
              <div class="rounded-full bg-primary/10 h-full w-full flex items-center justify-center text-sm font-semibold">
                {{ userInitial }}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="min-w-[160px]">
            <DropdownMenuItem as-child>
              <RouterLink to="/profile" class="flex w-full items-center">
                <User class="mr-2 h-4 w-4" />
                <span>Profile</span>
              </RouterLink>
            </DropdownMenuItem>
            <DropdownMenuItem @click="logout" class="flex items-center text-red-500 focus:text-red-500">
              <LogOut class="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
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
                  v-if="!isAuthenticated"
                  to="/auth"
                  class="flex items-center px-2 py-2 rounded-md hover:bg-muted text-sm font-medium"
                >
                  <User class="h-4 w-4 mr-2" />
                  Log in / Register
                </RouterLink>
                
                <template v-else>
                  <RouterLink
                    v-for="link in navLinks"
                    :key="link.name"
                    :to="link.href"
                    class="flex items-center px-2 py-2 rounded-md hover:bg-muted text-sm font-medium"
                  >
                    <component :is="link.icon" class="h-4 w-4 mr-2" />
                    {{ link.name }}
                  </RouterLink>
                  
                  <button 
                    @click="logout"
                    class="flex items-center px-2 py-2 rounded-md hover:bg-muted text-sm font-medium w-full text-left text-red-500"
                  >
                    <LogOut class="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </template>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  </header>
</template>