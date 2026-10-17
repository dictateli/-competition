<template>
<svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" :role="label ? 'img' : null" :aria-label="label || null" :aria-hidden="label ? null : 'true'" focusable="false"><title v-if="label">{{ label }}</title><path v-for="(d, i) in paths" :key="i" :d="d"></path></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
      name: { type: String, default: 'spark' },
      size: { type: [Number, String], default: 18 },
      label: { type: String, default: '' }
    },
    template: `<svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" :role="label ? 'img' : null" :aria-label="label || null" :aria-hidden="label ? null : 'true'" focusable="false"><title v-if="label">{{ label }}</title><path v-for="(d, i) in paths" :key="i" :d="d"></path></svg>`,
    computed: { paths: function () { return paths[this.name] || paths.spark; } }
  });
</script>
