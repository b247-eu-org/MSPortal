<template>
  <div class="dashboard-workspace">
    <!-- Header -->
    <div class="workspace-header">
      <h2>Welcome Back, {{ authStore.user?.name || 'IT Admin' }}</h2>
      <p class="subtitle">Operations overview and real-time tenant telemetry.</p>
    </div>

    <!-- Metric Cards Grid with Subtle Crimson Glow on Hover -->
    <div class="card-grid">
      <div class="stat-card">
        <div class="card-head">
          <span class="stat-label">MANAGED TENANTS</span>
          <Building2 :size="16" class="stat-icon" />
        </div>
        <div class="stat-value text-red">--</div>
        <div class="stat-desc">Microsoft 365 & Azure</div>
      </div>

      <div class="stat-card">
        <div class="card-head">
          <span class="stat-label">ACTIVE CUSTOMERS</span>
          <Users :size="16" class="stat-icon" />
        </div>
        <div class="stat-value">--</div>
        <div class="stat-desc">Organizations enrolled</div>
      </div>

      <div class="stat-card">
        <div class="card-head">
          <span class="stat-label">OPEN TICKETS</span>
          <Ticket :size="16" class="stat-icon" />
        </div>
        <div class="stat-value text-red">--</div>
        <div class="stat-desc">Pending triage</div>
      </div>

      <div class="stat-card">
        <div class="card-head">
          <span class="stat-label">KB ARTICLES</span>
          <BookOpen :size="16" class="stat-icon" />
        </div>
        <div class="stat-value">--</div>
        <div class="stat-desc">Published solutions</div>
      </div>
    </div>

    <!-- Main Canvas Area -->
    <div class="canvas-box">
      <div class="empty-state">
        <FolderClosed :size="36" class="empty-icon" />
        <h3>Ready for development</h3>
        <p>This layout is connected to your Go microservice with Level 3 JWKS authentication.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store';
// 👇 Import vector icons for the dashboard cards
import { Building2, Users, Ticket, BookOpen, FolderClosed } from 'lucide-vue-next';

const authStore = useAuthStore();
</script>

<style scoped>
.dashboard-workspace {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.workspace-header h2 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #ffffff;
}

.subtitle {
  color: #777777;
  font-size: 0.85rem;
  margin-top: 0.2rem;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
}

/* Stat Card with Crimson Hover Glow */
.stat-card {
  background: #181818;
  border: 1px solid #282828;
  border-radius: 6px;
  padding: 1.25rem;
  transition: all 0.2s ease;
}

.stat-card:hover {
  border-color: #383838;
  box-shadow: 0 0 15px rgba(220, 38, 38, 0.08);
  transform: translateY(-1px);
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-icon {
  color: #555555;
}

.stat-label {
  font-size: 0.7rem;
  font-weight: 800;
  color: #666666;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0.4rem 0 0.2rem 0;
}

.stat-value.text-red {
  color: #ef4444;
}

.stat-desc {
  font-size: 0.72rem;
  color: #777777;
}

.canvas-box {
  background: #181818;
  border: 1px dashed #2e2e2e;
  border-radius: 6px;
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
}

.empty-icon {
  color: #dc2626;
  margin-bottom: 0.75rem;
}

.empty-state h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.35rem;
}

.empty-state p {
  color: #666666;
  font-size: 0.85rem;
  max-width: 450px;
}
</style>