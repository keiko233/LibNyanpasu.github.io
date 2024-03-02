<template>
  <div class="box">
    <md-filled-tonal-icon-button
      v-if="selected"
      v-bind="$attrs"
      class="text-button"
    >
      <span class="material-icons">
        {{ props.icon }}
      </span>
    </md-filled-tonal-icon-button>

    <md-icon-button v-else v-bind="$attrs" class="text-button">
      <span class="material-icons">
        {{ props.icon }}
      </span>
    </md-icon-button>

    <span class="text" :class="{ selected }">
      <slot />
    </span>
  </div>
</template>

<script setup lang="ts">
import '@material/web/iconbutton/filled-tonal-icon-button.js'
import '@material/web/iconbutton/icon-button.js'

const props = defineProps<{
  selected?: boolean
  icon: string
}>()
</script>

<style scoped lang="scss">
.box {
  display: flex;
  flex-direction: column;
  align-items: center;

  .text-button {
    width: 64px;
    height: 32px;
  }

  span.text {
    font-size: 12px;
    line-height: 16px;

    &.selected {
      font-weight: 700;
      color: var(--md-sys-color-on-secondary-container);
    }
  }
}
</style>
