<template>
  <div class="app-main-nav">
    <div class="nav-menu">
      <i class="el-icon-menu" @click="handleMenuClick"></i>
    </div>
    <div class="nav-title">
      <span>{{ title }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
  },
  methods: {
    handleMenuClick() {
      this.$bus.$emit('open-mobile-menu');
    },
  },
};
</script>
