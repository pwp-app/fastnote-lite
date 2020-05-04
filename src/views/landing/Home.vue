<template>
    <section class="landing-main landing-desc">
        <div class="landing-desc-text animated fadeIn">
            <p>便签，从未如此高效。</p>
            <div class="landing-desc-text-small">
                <p>
                    全新的交互，让记事就像聊天一样快速、简单。
                </p>
            </div>
        </div>
        <transition enter-active-class="animated fadeIn faster">
            <div
                class="landing-desc-screenshot animated fadeInUp delay-500ms"
                v-show="screenshotLoaded"
            >
                <img :src="screenshot" @load="onScreenshotLoad" />
                <div class="landing-desc-screenshot-mask"></div>
            </div>
        </transition>
    </section>
</template>

<script>
export default {
    name: "landing.home",
    data() {
        return {
            screenshot: require("@/assets/images/screenshot.png"),
            screenshotLoaded: false
        };
    },
    methods: {
        onScreenshotLoad() {
            this.screenshotLoaded = true;
        }
    }
};
</script>