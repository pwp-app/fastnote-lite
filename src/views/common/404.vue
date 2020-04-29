<template>
    <div class="landing-main landing-404">
        <div class="landing-404-wrapper">
            <div class="landing-404-title">
                <p>404 not found</p>
                <div class="landing-404-title-small">
                    <p>这里什么也没有</p>
                </div>
            </div>
            <div class="landing-404-back">
                <el-button type="primary" @click="handleBack">返回之前的页面</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Landing.404',
    methods: {
        handleBack() {
            window.history.go(-1);
        }
    }
}
</script>