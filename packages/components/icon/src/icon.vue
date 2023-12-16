<template>
  <i :class="bem.b()" :style="style" v-bind="$attrs">
    <slot />
  </i>
</template>

<script setup lang="ts">
import { useNamespace } from '@nomi-ui/hooks'
import { computed } from 'vue'
import { iconProps } from './icon'

import type { CSSProperties } from 'vue'

defineOptions({
  name: 'MiIcon',
  inheritAttrs: false,
})
const props = defineProps(iconProps)
const bem = useNamespace('icon')

const style = computed<CSSProperties>(() => {
  const { color, size } = props
  if (!color && !size) return {}

  return {
    fontSize: `${size}px`,
    color,
  }
})
</script>
