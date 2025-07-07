import { createRouter, createWebHistory } from 'vue-router';
import Landing from './pages/Landing.vue';
import Index from './pages/Index.vue';
import NotFound from './pages/NotFound.vue';
import Auth from './pages/Auth.vue';
import Healthcheck from './pages/Healthcheck.vue';
import Profile from './pages/Profile.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Landing },
    { path: '/dashboard', component: Index },
    { path: '/health', component: Healthcheck},
    { path: '/map', component: NotFound },
    { path: '/settings', component: NotFound },
    { path: '/notifications', component: NotFound },
    { path: '/auth', component: Auth },
    { path: '/forgot-password', component: NotFound },
    { path: '/profile', component: Profile },
    { path: '/:pathMatch(.*)*', component: NotFound }
  ]
});

// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
  // Public routes that don't require authentication
  const publicRoutes = ['/auth', '/forgot-password', '/health', '/'];
  
  // Check if the user is authenticated
  // Replace this with your actual authentication check
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  if (publicRoutes.includes(to.path)) {
    next();
  } else if (!isAuthenticated) {
    // Redirect to auth if not authenticated
    next('/auth');
  } else {
    // validate the token here if needed
    
    next();
  }
});

export default router;