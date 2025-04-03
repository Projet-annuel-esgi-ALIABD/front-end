import { createRouter, createWebHistory } from 'vue-router';
import Index from './pages/Index.vue';
import NotFound from './pages/NotFound.vue';
import Auth from './pages/Auth.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Index },
    { path: '/map', component: NotFound },
    { path: '/settings', component: NotFound },
    { path: '/notifications', component: NotFound },
    { path: '/auth', component: Auth },
    { path: '/forgot-password', component: NotFound },
    // ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE
    { path: '/:pathMatch(.*)*', component: NotFound }
  ]
});

export default router;