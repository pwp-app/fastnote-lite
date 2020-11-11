<template>
  <div class="user">
    <div class="user-avatar">
      <el-avatar :size="72" :src="avatarSrc"></el-avatar>
      <div class="user-avatar-name">
        <span>{{ user.username || '' }}</span>
      </div>
    </div>
    <div class="user-main">
      <ul class="user-main-menu">
        <li class="user-main-menu__item" @click="handleLogout">登出</li>
      </ul>
    </div>
  </div>
</template>

<script>
import md5 from "crypto-js/md5";

export default {
  props: {
    user: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    avatarSrc() {
      const { email } = this.user;
      const mailUrl = `/${md5(email).toString()}`;
      return `https://www.gravatar.com/avatar${email ? mailUrl : '' }?s=128`;
    },
  },
  methods: {
    handleLogout() {
      this.$auth.authToken = null;
      this.$auth.refreshToken = null;
      window.localStorage.removeItem('cloud-auth');
      this.$message.success('登出成功');
      this.$router.push('/');
    },
  },
};
</script>