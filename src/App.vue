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
// define window vars
window.os = (function () {
  const UserAgent = navigator.userAgent.toLowerCase();
  return {
    isIpad: /ipad/i.test(UserAgent),
    isIphone: /iphone os/i.test(UserAgent),
    isAndroid: /android/i.test(UserAgent),
    isWindowsCe: /windows ce/i.test(UserAgent),
    isWindowsMobile: /windows mobile/i.test(UserAgent),
    isWin: /windows nt/i.test(UserAgent),
    isWin2K: /windows nt 5.0/i.test(UserAgent),
    isXP: /windows nt 5.1/i.test(UserAgent),
    isVista: /windows nt 6.0/i.test(UserAgent),
    isWin7: /windows nt 6.1/i.test(UserAgent),
    isWin8: /windows nt 6.2/i.test(UserAgent),
    isWin81: /windows nt 6.3/i.test(UserAgent),
    isWin10: /windows nt 10/i.test(UserAgent),
    isMac: /mac os/i.test(UserAgent),
    is64bit: /(wow64|win64)/i.test(UserAgent),
  };
})();

window.os.isMobile = window.os.isIpad || window.os.isIphone || window.os.isAndroid;

export default {
  name: "App",
  beforeCreate() {
    if (window.os.isMobile) {
      this.$router.push('/mobile/landing');
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