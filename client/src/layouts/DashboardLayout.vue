<template>
  <div class="erp-container">
    <!-- LEFT SIDEBAR -->
    <aside class="sidebar">
      <!-- Brand Logo -->
      <div class="sidebar-brand">
        <div class="logo-box">RSK</div>
        <div class="brand-text">
          <span class="title">MSP Portal</span>
          <span class="subtitle">Managed IT Operations</span>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="sidebar-nav">
        <div class="nav-header">OPERATIONS</div>

        <RouterLink to="/" class="nav-item" active-class="active">
          <LayoutDashboard :size="18" class="nav-icon" />
          <span class="label">Dashboard</span>
        </RouterLink>

        <a href="#tenants" class="nav-item">
          <Building2 :size="18" class="nav-icon" />
          <span class="label">Managed Tenants</span>
        </a>

        <a href="#customers" class="nav-item">
          <Users :size="18" class="nav-icon" />
          <span class="label">Customers</span>
        </a>

        <a href="#tickets" class="nav-item">
          <Ticket :size="18" class="nav-icon" />
          <span class="label">Tickets</span>
          <span class="badge-red">Active</span>
        </a>

        <div class="nav-header" style="margin-top: 1.5rem;">KNOWLEDGE & LOGS</div>

        <a href="#kb" class="nav-item">
          <BookOpen :size="18" class="nav-icon" />
          <span class="label">Knowledge Base</span>
        </a>

        <a href="#reports" class="nav-item">
          <BarChart3 :size="18" class="nav-icon" />
          <span class="label">Reports</span>
        </a>

        <a href="#activity" class="nav-item">
          <Activity :size="18" class="nav-icon" />
          <span class="label">Activity Logs</span>
        </a>
      </nav>

      <!-- USER PROFILE & LOGOUT FOOTER -->
      <div class="sidebar-user">
        <div class="user-card">
          <div class="avatar-container">
            <img 
              v-if="authStore.userPhoto" 
              :src="authStore.userPhoto" 
              alt="Profile" 
              class="user-photo" 
            />
            <div v-else class="user-initials">{{ userInitials }}</div>
          </div>
          
          <div class="user-info">
            <span class="user-name">{{ authStore.user?.name || 'IT Admin' }}</span>
            <span class="user-email">{{ authStore.user?.username }}</span>
          </div>
        </div>

        <button class="btn-logout" @click="handleLogout" title="Sign Out">
          <LogOut :size="18" />
        </button>
      </div>
    </aside>

    <!-- RIGHT MAIN WORKSPACE -->
    <div class="main-wrapper">
      <!-- TOPBAR WITH SEARCH -->
      <header class="topbar">
        <!-- Quick Search Box -->
        <div class="topbar-search">
          <Search :size="16" class="search-icon" />
          <input 
            type="text" 
            placeholder="Search tenants, users, tickets... (Ctrl + K)" 
          />
        </div>

        <div class="topbar-right">
          <div class="status-badge">
            <span class="dot"></span>
            <span>Level 3 JWKS Active</span>
          </div>
        </div>
      </header>

      <!-- Main Body -->
      <main class="content-body">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, RouterLink, RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

// 👇 HERE ARE THE LUCIDE ICON IMPORTS
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Ticket, 
  BookOpen, 
  BarChart3, 
  Activity, 
  LogOut,
  Search 
} from 'lucide-vue-next';

const authStore = useAuthStore();
const router = useRouter();

const userInitials = computed(() => {
  const name = authStore.user?.name || authStore.user?.username || 'AD';
  return name.slice(0, 2).toUpperCase();
});

async function handleLogout() {
  await authStore.logout();
  router.push({ name: 'login' });
}
</script>

<style scoped>
.erp-container {
  display: flex;
  min-height: 100vh;
  background: #121212;
  color: #ededed;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* SIDEBAR */
.sidebar {
  width: 260px;
  background: #181818;
  border-right: 1px solid #282828;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-brand {
  height: 65px;
  padding: 0 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid #282828;
}

.logo-box {
  background: #dc2626;
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: 900;
  padding: 0.35rem 0.65rem;
  border-radius: 4px;
  letter-spacing: 0.05em;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.4);
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #ffffff;
}

.subtitle {
  font-size: 0.7rem;
  color: #777777;
}

.sidebar-nav {
  padding: 1.25rem 0.75rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  overflow-y: auto;
}

.nav-header {
  font-size: 0.65rem;
  font-weight: 800;
  color: #555555;
  padding: 0 0.75rem 0.4rem 0.75rem;
  letter-spacing: 0.08em;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.65rem 0.85rem;
  color: #888888;
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.nav-icon {
  flex-shrink: 0;
  color: #777777;
  transition: color 0.15s ease;
}

.nav-item:hover {
  background: #222222;
  color: #ffffff;
}

.nav-item:hover .nav-icon {
  color: #ffffff;
}

.nav-item.active {
  background: rgba(220, 38, 38, 0.12);
  color: #ffffff;
  font-weight: 600;
  border-left: 3px solid #dc2626;
}

.nav-item.active .nav-icon {
  color: #ef4444;
}

.badge-red {
  margin-left: auto;
  font-size: 0.68rem;
  background: #dc2626;
  color: #ffffff;
  padding: 0.1rem 0.45rem;
  border-radius: 3px;
  font-weight: 700;
}

/* User Profile Footer */
.sidebar-user {
  padding: 0.9rem 1rem;
  border-top: 1px solid #282828;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #141414;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  overflow: hidden;
}

.avatar-container {
  width: 38px;
  height: 38px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid #383838;
  background: #222222;
}

.user-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-initials {
  width: 100%;
  height: 100%;
  background: #dc2626;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.85rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.user-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.user-email {
  font-size: 0.7rem;
  color: #666666;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.btn-logout {
  background: transparent;
  border: none;
  color: #666666;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.btn-logout:hover {
  background: #242424;
  color: #ef4444;
}

/* MAIN AREA */
.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.topbar {
  height: 65px;
  background: #181818;
  border-bottom: 1px solid #282828;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
}

/* Topbar Search Input */
.topbar-search {
  position: relative;
  width: 380px;
}

.topbar-search input {
  width: 100%;
  background: #121212;
  border: 1px solid #2e2e2e;
  color: #ffffff;
  padding: 0.55rem 1rem 0.55rem 2.2rem;
  border-radius: 6px;
  font-size: 0.85rem;
  outline: none;
  transition: all 0.2s ease;
}

.topbar-search input:focus {
  border-color: #dc2626;
  background: #181818;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666666;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #ff4d4d;
  background: rgba(220, 38, 38, 0.1);
  padding: 0.35rem 0.8rem;
  border-radius: 4px;
  border: 1px solid rgba(220, 38, 38, 0.3);
  font-weight: 600;
}

.dot {
  width: 6px;
  height: 6px;
  background: #dc2626;
  border-radius: 50%;
  box-shadow: 0 0 6px #dc2626;
}

.content-body {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}
</style>