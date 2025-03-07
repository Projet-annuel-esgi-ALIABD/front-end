<script setup>
import { ref, computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { z } from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-vue-next';

const router = useRouter();
const { toast } = useToast();
const isSubmitting = ref(false);
const activeTab = ref('login');

// Login form validation schema
const loginSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters',
  }),
});

// Register form validation schema
const registerSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters',
  }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Setup login form
const { handleSubmit: handleLoginSubmit, errors: loginErrors } = useForm({
  validationSchema: toTypedSchema(loginSchema),
});

// Setup register form
const { handleSubmit: handleRegisterSubmit, errors: registerErrors } = useForm({
  validationSchema: toTypedSchema(registerSchema),
});

// Submit login form
const onLoginSubmit = handleLoginSubmit(async (values) => {
  try {
    isSubmitting.value = true;
    // Here you would authenticate with your backend
    console.log('Login form submitted:', values);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Show success toast
    toast({
      title: "Login successful",
      description: "Welcome back to EcoSense!",
      variant: "success",
    });

    // Redirect to dashboard
    router.push('/');
  } catch (error) {
    toast({
      title: "Login failed",
      description: error.message || "Please check your credentials and try again.",
      variant: "destructive",
    });
  } finally {
    isSubmitting.value = false;
  }
});

// Submit register form
const onRegisterSubmit = handleRegisterSubmit(async (values) => {
  try {
    isSubmitting.value = true;
    // Here you would register with your backend
    console.log('Register form submitted:', values);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Show success toast
    toast({
      title: "Registration successful",
      description: "Your account has been created. Welcome to EcoSense!",
      variant: "success",
    });

    // Redirect to dashboard
    router.push('/');
  } catch (error) {
    toast({
      title: "Registration failed",
      description: error.message || "Please check your information and try again.",
      variant: "destructive",
    });
  } finally {
    isSubmitting.value = false;
  }
});

// Handle tab switching with animation
const switchTab = (tab) => {
  // Add a small delay to allow the animation to complete
  setTimeout(() => {
    activeTab.value = tab;
  }, 50);
};
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-start bg-background p-4">
    <div class="text-center mb-6">
      <RouterLink to="/" class="flex items-center justify-center">
        <div class="relative mr-4 h-10 w-10">
          <div class="absolute inset-0 rounded-full bg-primary/20 animate-pulse-slow"></div>
          <div class="absolute inset-1 rounded-full bg-primary/40"></div>
          <div class="absolute inset-2 rounded-full bg-primary/60"></div>
          <div class="absolute inset-3 rounded-full bg-primary/80"></div>
          <div class="absolute inset-[14px] rounded-full bg-primary"></div>
        </div>
        <span class="font-semibold text-3xl">EcoSense</span>
      </RouterLink>
      <p class="text-muted-foreground mt-2">Smart City Environmental Platform</p>
    </div>

    <div class="w-full max-w-md animate-fade-in">
      <Tabs v-model="activeTab" class="w-full">
        <TabsList class="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="login" @click="switchTab('login')">Login</TabsTrigger>
          <TabsTrigger value="register" @click="switchTab('register')">Register</TabsTrigger>
        </TabsList>

        <div class="relative">
          <Transition name="tab-transition" mode="out-in">
            <TabsContent :key="'login-tab'" :value="'login'" v-if="activeTab === 'login'" class="transition-wrapper">
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <form @submit.prevent="onLoginSubmit" class="space-y-4">
                    <div class="space-y-2">
                      <Label for="login-email">Email</Label>
                      <Input id="login-email" name="email" type="email" placeholder="your.email@example.com" />
                      <p v-if="loginErrors.email" class="text-sm text-destructive flex items-center gap-1 mt-1">
                        <AlertCircle class="h-3 w-3" /> {{ loginErrors.email }}
                      </p>
                    </div>
                    <div class="space-y-2">
                      <div class="flex items-center justify-between">
                        <Label for="login-password">Password</Label>
                        <RouterLink to="/forgot-password" class="text-xs text-primary hover:underline">
                          Forgot password?
                        </RouterLink>
                      </div>
                      <Input id="login-password" name="password" type="password" />
                      <p v-if="loginErrors.password" class="text-sm text-destructive flex items-center gap-1 mt-1">
                        <AlertCircle class="h-3 w-3" /> {{ loginErrors.password }}
                      </p>
                    </div>
                    <Button type="submit" class="w-full" :disabled="isSubmitting">
                      <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
                      {{ isSubmitting ? 'Logging in...' : 'Login' }}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter class="flex justify-center">
                  <p class="text-sm text-muted-foreground">
                    Don't have an account?
                    <a @click="switchTab('register')"
                      class="text-primary cursor-pointer hover:underline transition-colors duration-200">Register</a>
                  </p>
                </CardFooter>
              </Card>
              <div class="mt-8 text-center">
                <Button variant="ghost" as-child>
                  <RouterLink to="/">Return to home page</RouterLink>
                </Button>
              </div>
            </TabsContent>

            <TabsContent :key="'register-tab'" :value="'register'" v-else class="transition-wrapper">
              <Card>
                <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>Register to access the EcoSense platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <form @submit.prevent="onRegisterSubmit" class="space-y-4">
                    <div class="space-y-2">
                      <Label for="register-name">Full Name</Label>
                      <Input id="register-name" name="name" type="text" placeholder="John Doe" />
                      <p v-if="registerErrors.name" class="text-sm text-destructive flex items-center gap-1 mt-1">
                        <AlertCircle class="h-3 w-3" /> {{ registerErrors.name }}
                      </p>
                    </div>
                    <div class="space-y-2">
                      <Label for="register-email">Email</Label>
                      <Input id="register-email" name="email" type="email" placeholder="your.email@example.com" />
                      <p v-if="registerErrors.email" class="text-sm text-destructive flex items-center gap-1 mt-1">
                        <AlertCircle class="h-3 w-3" /> {{ registerErrors.email }}
                      </p>
                    </div>
                    <div class="space-y-2">
                      <Label for="register-password">Password</Label>
                      <Input id="register-password" name="password" type="password" />
                      <p v-if="registerErrors.password" class="text-sm text-destructive flex items-center gap-1 mt-1">
                        <AlertCircle class="h-3 w-3" /> {{ registerErrors.password }}
                      </p>
                    </div>
                    <div class="space-y-2">
                      <Label for="register-confirm-password">Confirm Password</Label>
                      <Input id="register-confirm-password" name="confirmPassword" type="password" />
                      <p v-if="registerErrors.confirmPassword"
                        class="text-sm text-destructive flex items-center gap-1 mt-1">
                        <AlertCircle class="h-3 w-3" /> {{ registerErrors.confirmPassword }}
                      </p>
                    </div>
                    <Button type="submit" class="w-full" :disabled="isSubmitting">
                      <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
                      {{ isSubmitting ? 'Creating account...' : 'Register' }}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter class="flex justify-center">
                  <p class="text-sm text-muted-foreground">
                    Already have an account?
                    <a @click="switchTab('login')"
                      class="text-primary cursor-pointer hover:underline transition-colors duration-200">Login</a>
                  </p>
                </CardFooter>
              </Card>
              <div class="mt-8 text-center">
                <Button variant="ghost" as-child>
                  <RouterLink to="/">Return to home page</RouterLink>
                </Button>
              </div>
            </TabsContent>
          </Transition>
        </div>
      </Tabs>
    </div>

  </div>
</template>

<style scoped>
.tab-transition-enter-active,
.tab-transition-leave-active {
  transition: all 0.3s ease;
}

.tab-transition-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.tab-transition-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.transition-wrapper {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

/* Only apply absolute positioning during transitions */
.tab-transition-enter-active .transition-wrapper,
.tab-transition-leave-active .transition-wrapper {
  position: absolute;
}

/* Fix for ensuring cards don't collapse during transition */
.tabs-content {
  min-height: 500px;
  position: relative;
}
</style>
