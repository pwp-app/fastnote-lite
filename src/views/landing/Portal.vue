<template>
  <section class="landing-main landing-portal">
    <div class="landing-portal-wrapper">
      <div class="portal-loading" v-if="pinging">
        <div class="portal-loading-icon">
          <i class="el-icon-loading"></i>
        </div>
        <div class="portal-loading-text">
          <p>正在检查服务器状态...</p>
        </div>
      </div>
    </div>
    <div class="landing-portal-wrapper" v-if="!pinging && usable">
      <PortalForm v-if="!autoLogin"/>
      <div class="portal-loading" v-else>
        <div class="portal-loading-icon">
          <i class="el-icon-loading"></i>
        </div>
        <div class="portal-loading-text">
          <p>正在自动登录中...</p>
        </div>
      </div>
    </div>
    <div class="landing-portal-wrapper" v-if="!pinging && !usable">
      <div class="portal-disabled">
        <div class="portal-disabled-icon">
          <i class="el-icon-close"></i>
        </div>
        <div class="portal-disabled-text">
          <p>非常抱歉</p>
          <p>Fastnote Cloud 暂时不可用</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import PortalForm from '../../components/portal/PortalForm';

export default {
  name: 'Landing.Portal',
  components: {
    PortalForm,
  },
  data() {
    return {
      logo: require('@/assets/images/logo.png'),
      usable: false,
      pinging: false,
      autoLogin: (this.$auth.authToken || this.$auth.refreshToken) ? true : false,
    };
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
}
</script>
