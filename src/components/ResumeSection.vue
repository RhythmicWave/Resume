<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  title: string
  icon: Component
}>()
</script>

<template>
  <section class="resume-section">
    <div class="section-heading">
      <component :is="icon" :size="17" stroke-width="2.5" aria-hidden="true" />
      <h2>{{ title }}</h2>
    </div>
    <div class="section-body">
      <slot />
    </div>
  </section>
</template>
