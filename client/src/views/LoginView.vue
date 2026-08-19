<template>
  <div class="login-wrapper">
    <div class="login-card">
      <div class="brand-header">
        <div class="logo-box">MSP</div>
        <h1>Nexus Portal</h1>
        <p class="tagline">Enterprise Cloud Management</p>
      </div>

      <div class="separator"></div>

      <div class="auth-action">
        <button class="btn-microsoft" @click="handleLogin" :disabled="authStore.loading">
          <svg width="20" height="20" viewBox="0 0 21 21">
            <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
            <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
            <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
            <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
          </svg>
          <span>{{ authStore.loading ? 'Signing in...' : 'Sign in with Microsoft' }}</span>
        </button>

        <p v-if="authStore.error" class="error-banner">
          {{ authStore.error }}
        </p>
      </div>

      <div class="card-footer">
        <span>🔒 Secured via Microsoft Entra ID (Level 3 JWKS)</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();
const router = useRouter();

async function handleLogin() {
  try {
    await authStore.login();
    if (authStore.isAuthenticated) {
      router.push({ name: 'dashboard' });
    }
  } catch (err) {
    console.error('Login error:', err);
  }
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #121212;
  padding: 1.5rem;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: #181818;
  border: 1px solid #282828;
  border-radius: 8px;
  padding: 2.5rem 2rem;
  text-align: center;
}

.logo-box {
  background: #dc2626;
  color: white;
  font-size: 0.85rem;
  font-weight: 900;
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.brand-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
}

.brand-header .tagline {
  color: #777777;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.separator {
  height: 1px;
  background: #282828;
  margin: 1.75rem 0;
}

.btn-microsoft {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  background: #202020;
  border: 1px solid #333333;
  color: #ffffff;
  padding: 0.85rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-microsoft:hover:not(:disabled) {
  background: #282828;
  border-color: #dc2626;
}

.btn-microsoft:disabled {
  opacity: 0.6;
}

.error-banner {
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid #dc2626;
  color: #ff6b6b;
  border-radius: 4px;
  font-size: 0.85rem;
}

.card-footer {
  margin-top: 2rem;
  font-size: 0.72rem;
  color: #555555;
}
</style>