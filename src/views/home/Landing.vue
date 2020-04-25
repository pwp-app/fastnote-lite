<template>
    <div class="landing">
        <header class="landing-header">
            <div class="landing-header-content clearfix">
                <div class="landing-header-logo" @click="handleLogoClicked">
                    <img :src="logo">
                    <span>Fastnote</span>
                </div>
                <nav class="landing-header-nav">
                    <a>下载</a>
                    <a>更新日志</a>
                    <div class="landing-header-nav-button">
                        <el-popover
                            placement="bottom"
                            width="200"
                            title=""
                            trigger="hover"
                            content="网页版施工中，开放时间待定"
                            popper-class="landing-nav-popper">
                            <span slot="reference">
                                <el-button type="primary" round disabled>登录网页版</el-button>
                            </span>
                        </el-popover>
                    </div>
                </nav>
                <div class="clear"></div>
            </div>
        </header>
        <transition mode="out-in">
            <section class="landing-desc" v-if="currentSection === 'desc'">
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
        </transition>
        <footer class="landing-footer">
            <div class="landing-footer-container">
                <div class="landing-footer-copyright">
                    <span>Copyright &copy; 2020 pwp.app. All rights reserved.</span>
                </div>
                <div class="landing-footer-divide"></div>
                <div class="landing-footer-opensource" @click="openGitHub">
                    <svg width="19" height="19" viewBox="0 0 14 14" aria-label="github"><path d="M7 .175c-3.872 0-7 3.128-7 7 0 3.084 2.013 5.71 4.79 6.65.35.066.482-.153.482-.328v-1.181c-1.947.415-2.363-.941-2.363-.941-.328-.81-.787-1.028-.787-1.028-.634-.438.044-.416.044-.416.7.044 1.071.722 1.071.722.635 1.072 1.641.766 2.035.59.066-.459.24-.765.437-.94-1.553-.175-3.193-.787-3.193-3.456 0-.766.262-1.378.721-1.881-.065-.175-.306-.897.066-1.86 0 0 .59-.197 1.925.722a6.754 6.754 0 0 1 1.75-.24c.59 0 1.203.087 1.75.24 1.335-.897 1.925-.722 1.925-.722.372.963.131 1.685.066 1.86.46.48.722 1.115.722 1.88 0 2.691-1.641 3.282-3.194 3.457.24.219.481.634.481 1.29v1.926c0 .197.131.415.481.328C11.988 12.884 14 10.259 14 7.175c0-3.872-3.128-7-7-7z" fill="currentColor" fill-rule="nonzero"></path></svg>
                </div>
            </div>
        </footer>
    </div>
</template>

<script>
export default {
    name: 'Landing',
    data() {
        return {
            logo: require('@/assets/images/logo.png'),
            screenshot: require('@/assets/images/screenshot.png'),
            // vars
            currentSection: 'desc'
        }
    },
    methods: {
        handleLogoClicked() {
            this.currentSection = 'desc';
        },
        openGitHub() {
            window.open('https://github.com/pwp-app/Fastnote');
        }
    }
}
</script>