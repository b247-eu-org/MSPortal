<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<style>
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #121212;
  color: #ededed;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

/* Crimson Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #121212;
}
::-webkit-scrollbar-thumb {
  background: #2a2a2a;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #dc2626;
}
</style>