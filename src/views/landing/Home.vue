<template>
    <section class="landing-main landing-desc">
        <div class="landing-desc-text animated fadeIn">
            <p>便签，从来没有这么高效过。</p>
            <div class="landing-desc-text-small">
                <p>
                    Fastnote 以即时聊天一般的交互，给你带来全新的记事体验。
                </p>
            </div>
        </div>
        <div class="landing-desc-screenshot animated fadeInUp delay-500ms">
            <img :src="screenshot" />
            <div class="landing-desc-screenshot-mask"></div>
        </div>
    </section>
</template>

<script>
export default {
    name: "landing.home",
    data() {
        return {
            screenshot: require("@/assets/images/screenshot.png")
        };
    }
};
</script>