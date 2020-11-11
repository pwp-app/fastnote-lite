<template>
  <div class="context-menu"
    v-show="show"
    :style="{
      left: `${position.x || 0}px`,
      top: `${position.y || 0}px`,
    }"
    >
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    show: Boolean,
    position: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    show: 'handleShowChanged',
  },
  methods: {
    handleShowChanged(show) {
      console.log(show);
      if (show) {
        document.addEventListener('mousedown', this.handleHide);
        document.addEventListener('mousewheel', this.handleHide);
      } else {
        document.removeEventListener('mousedown', this.handleHide);
        document.removeEventListener('mousewheel', this.handleHide);
      }
    },
    handleHide() {
      this.$emit('close');
    },
  },
}
</script>