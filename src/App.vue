<template>
  <div id="app">
    <transition mode="out-in">
      <keep-alive v-if="$route.meta.keepAlive">
        <router-view></router-view>
      </keep-alive>
      <router-view v-else></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: "App",
  beforeCreate() {
    if (window.os.isMobile) {
      const url = window.location.href;
      if (!url.includes('/mobile') && !url.includes('/app')) {
        this.$router.push('/mobile/landing');
      }
    } else if (!window.os.isWin) {
      this.$router.push('/unavailable');
    }
  },
};
</script>

<style>
.v-enter {
  opacity: 0;
}
.v-enter-active {
  transition: 200ms;
}
.v-enter-to {
  opacity: 1;
}
.v-leave {
  opacity: 1;
}
.v-leave-to {
  opacity: 0;
}
.v-leave-active {
  transition: 200ms;
}
</style>