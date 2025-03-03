import { createApp } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import App from './App.vue';
import router from './router';
import './style.css'

// Create the app
const app = createApp(App);

// Create the query client
const vueQueryPluginOptions = {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  },
};

// Install plugins
app.use(VueQueryPlugin, vueQueryPluginOptions);
app.use(router); // Add this line to install the router

// Mount the app
app.mount('#app');