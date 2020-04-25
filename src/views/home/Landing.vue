<template>
    <div class="landing">
        <header class="landing-header">
            <div class="landing-header-content clearfix">
                <div class="landing-header-logo">
                    <img :src="logo">
                    <span>Fastnote</span>
                </div>
                <nav class="landing-header-nav">
                    <a>下载</a>
                    <a>更新日志</a>
                    <div class="landing-header-nav-button">
                        <el-button type="primary" round disabled>登录网页版</el-button>
                    </div>
                </nav>
                <div class="clear"></div>
            </div>
        </header>
        <section class="landing-desc">
            <div class="landing-desc-text">
                <p>便签，从来没有这么高效过。</p>
                <div class="landing-desc-text-small">
                    <p>Fastnote 以即时聊天一般的交互，给你带来全新的记事体验。</p>
                </div>
            </div>
            <div class="landing-desc-screenshot">
                <img :src="screenshot">
                <div class="landing-desc-screenshot-mask"></div>
            </div>
        </section>
        <section class="landing-download">
            
        </section>
    </div>
</template>

<script>
export default {
    name: 'Landing',
    data() {
        return {
            logo: require('@/assets/images/logo.png'),
            screenshot: require('@/assets/images/screenshot.png')
        }
    }
}
</script>