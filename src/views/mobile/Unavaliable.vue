<template>
    <div class="mobile-unavaliable">
        <div class="mobile-unavaliable-wrapper">
            <div class="mobile-unavaliable-logo">
                <img :src="logo">
            </div>
            <div class="mobile-unavaliable-text">
                <p>很抱歉</p>
                <p>Fastnote 暂时不支持您的设备</p>
            </div>
        </div>
        <footer class="mobile-unavaliable-footer">
            <span>Copyright &copy; 2020 pwp.app</span>
        </footer>
    </div>
</template>

<script>
export default {
    name: 'Mobile.Unavaliable',
    data() {
        return {
            logo: require('@/assets/images/logo.png'),
        }
    }
}
</script>