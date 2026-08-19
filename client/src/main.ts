import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { AuthService } from './services/auth.service';
import { useAuthStore } from './stores/auth.store';

async function bootstrap() {
  // 1. Initialize MSAL
  await AuthService.initialize();

  const app = createApp(App);
  const pinia = createPinia();
  app.use(pinia);

  // 2. Hydrate auth store with current logged-in account (if any)
  const authStore = useAuthStore();
  authStore.checkAuth();

  // 3. Mount Router and App
  app.use(router);
  app.mount('#app');
}

bootstrap();