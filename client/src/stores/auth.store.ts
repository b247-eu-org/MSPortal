import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { AccountInfo } from '@azure/msal-browser';
import { AuthService } from '@/services/auth.service';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AccountInfo | null>(null);
  const userPhoto = ref<string | null>(localStorage.getItem('ms_user_photo'));
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!user.value);

  async function fetchProfilePhoto() {
    const photo = await AuthService.getProfilePhoto();
    userPhoto.value = photo;
    if (photo) {
      localStorage.setItem('ms_user_photo', photo);
    } else {
      localStorage.removeItem('ms_user_photo');
    }
  }

  function checkAuth() {
    user.value = AuthService.getAccount();
    if (user.value && !userPhoto.value) {
      fetchProfilePhoto();
    }
  }

  async function login() {
    loading.value = true;
    error.value = null;
    try {
      user.value = await AuthService.login();
      await fetchProfilePhoto();
    } catch (err: any) {
      error.value = err.message || 'Login failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    localStorage.clear();
    user.value = null;
    userPhoto.value = null;
    await AuthService.logout();
  }

  return {
    user,
    userPhoto,
    loading,
    error,
    isAuthenticated,
    checkAuth,
    login,
    logout,
  };
});