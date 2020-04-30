<template>
    <div class="landing">
        <header class="landing-header">
            <div class="landing-header-content clearfix">
                <div class="landing-header-logo" @click="handleLogoClicked">
                    <img :src="logo">
                    <span>Fastnote</span>
                </div>
                <nav class="landing-header-nav" v-if="$route.path !== '/404'">
                    <a v-for="navItem in nav" :key="navItem.section" :data-section="navItem.section" @click="handleNavClicked($event)">
                        {{ navItem.name }}
                    </a>
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
        <transition name="landing-sections" mode="out-in" enter-active-class="animated fadeInRight faster" leave-to-class="animated fadeOutLeft faster">
            <router-view></router-view>
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
const verFileBase = "https://update.backrunner.top/fastnote";
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
    name: 'Landing',
    data() {
        return {
            logo: require('@/assets/images/logo.png'),
            // nav
            nav: [
                {
                    name: '下载',
                    section: 'download'
                },
                {
                    name: '更新日志',
                    section: 'changelog'
                }
            ],
        }
    },
    beforeCreate() {
        // 使用这种方式提前加载内容
        if (window.os.isWin7 || window.os.isWin8 || window.os.isWin81 || window.os.isWin10) {
            this.$store.commit('client/setStatus', 'fetching');
            this.axios.get(`${verFileBase}/win32/${window.os.is64bit ? 'x64/' : ''}ver.json`).then(res => {
                if (res.status === 200) {
                    this.$store.commit('client/setStatus', 'resolved');
                    this.$store.commit('client/setVersion', res.data.ver);
                }
            }).catch(() => {
                this.$store.commit('client/setStatus', 'failed');
            });
        } else {
            this.$store.commit('client/setStatus', 'unavaliable');
        }
    },
    methods: {
        handleNavClicked(e) {
            this.$router.push(`/${e.target.getAttribute('data-section')}`);
        },
        handleLogoClicked() {
            this.currentSection = this.$router.push(`/`);
        },
        openGitHub() {
            window.open('https://github.com/pwp-app/Fastnote');
        }
    }
}
</script>