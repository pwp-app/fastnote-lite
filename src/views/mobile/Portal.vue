<template>
  <div class="mobile-portal-wrapper">
    <div class="mobile-portal mobile-portal-pinging" v-if="showPinging">
      <van-loading size="24px" vertical color="#1faeff">
        正在检查服务状态...
      </van-loading>
    </div>
    <div class="mobile-portal" v-if="showPortal">
      <PortalForm v-if="!autoLogin" />
      <div class="mobile-portal-autologin" v-else>
        <van-loading size="24px" vertical color="#1faeff">
          正在尝试自动登录...
        </van-loading>
      </div>
    </div>
    <div class="mobile-portal mobile-portal-disabled" v-if="showDisabled">
      <div class="mobile-portal-disabled-icon">
        <i class="el-icon-close"></i>
      </div>
      <div class="mobile-portal-disabled-text">
        <p>非常抱歉</p>
        <p>服务暂时不可用</p>
      </div>
      <el-button type="primary" round @click="goBack">返回</el-button>
    </div>
  </div>
</template>

<script>
import PortalForm from "../../components/portal/PortalForm";

export default {
  components: {
    PortalForm,
  },
  data() {
    return {
      pinging: false,
      usable: false,
      autoLogin: (this.$auth.authToken || this.$auth.refreshToken) ? true : false,
    };
  },
  computed: {
    showPinging() {
      return this.pinging;
    },
    showPortal() {
      return !this.pinging && this.usable;
    },
    showDisabled() {
      return !this.pinging && !this.usable;
    },
  },
  async created() {
    this.pinging = true;
    this.usable = await this.$pingCloud();
    this.pinging = false;
    if (this.autoLogin && this.usable) {
      await this.tryAutoLogin();
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    async tryAutoLogin() {
      if (this.$auth.authToken) {
        const res = await this.$pingCloudAuth();
        // authToken可用 直接登录
        if (res) {
          this.$router.push('/app');
          return;
        }
      }
      // authToken不存在或不可用，刷新
      if (this.$auth.refreshToken) {
        const res = await this.$refreshToken();
        if (res) {
          const pingRes = await this.$pingCloudAuth();
          if (pingRes) {
            this.$router.push('/app');
            return;
          } else {
            this.$message.error('自动登录失败');
            this.autoLogin = false;
            return;
          }
        } else {
          this.$message.error('自动登录失败');
          this.autoLogin = false;
          return;
        }
      }
      // 兜底
      this.autoLogin = false;
    },
  },
};
</script>
