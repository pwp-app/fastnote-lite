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
window.os = (function() {
    const UserAgent = navigator.userAgent.toLowerCase();
    return {
        isIpad: /ipad/.test(UserAgent),
        isIphone: /iphone os/.test(UserAgent),
        isAndroid: /android/.test(UserAgent),
        isWindowsCe: /windows ce/.test(UserAgent),
        isWindowsMobile: /windows mobile/.test(UserAgent),
        isWin: /windows nt/.test(UserAgent),
        isWin2K: /windows nt 5.0/.test(UserAgent),
        isXP: /windows nt 5.1/.test(UserAgent),
        isVista: /windows nt 6.0/.test(UserAgent),
        isWin7: /windows nt 6.1/.test(UserAgent),
        isWin8: /windows nt 6.2/.test(UserAgent),
        isWin81: /windows nt 6.3/.test(UserAgent),
        isWin10: /windows nt 10.0/.test(UserAgent),
        isMac: /mac os/.test(UserAgent),
        is64bit: /(wow64|win64)/.test(UserAgent)
    };
})();

export default {
    name: "App",
    beforeCreate() {
        if (window.os.isAndroid || window.os.isIpad || window.os.isIphone) {
            this.$router.push('/mobile/unavaliable')
        }
    }
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