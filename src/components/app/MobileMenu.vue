<template>
  <div class="mobile-menu">
    <div class="mobile-menu-group">
      <p class="mobile-menu-group__title">用户信息</p>
      <div class="mobile-menu-items">
        <div class="mobile-menu-item mobile-menu-user">
          <el-avatar :size="28" :src="avatarSrc"></el-avatar>
          <span>{{ displayUsername }}</span>
        </div>
        <div class="mobile-menu-item mobile-menu-logout" @click="handleLogout">
          <span>登出</span>
        </div>
      </div>
    </div>
    <div class="mobile-menu-group">
      <p class="mobile-menu-group__title">便签分类</p>
      <div class="mobile-menu-items mobile-menu-categories">
        <MobileCategoryItem
          v-for="category in categories"
          :key="category.name"
          :category="category"
          :currentCategory="currentCategory"
        />
      </div>
    </div>
  </div>
</template>

<script>
import md5 from "crypto-js/md5";
import MobileCategoryItem from "./MobileCategoryItem";

export default {
  props: {
    user: {
      type: Object,
      default: () => ({}),
    },
    categories: {
      type: Array,
      default: () => [],
    },
    currentCategory: {
      type: String,
      default: "",
    },
  },
  components: {
    MobileCategoryItem,
  },
  computed: {
    displayUsername() {
      return this.user.username || "";
    },
    avatarSrc() {
      const mailUrl = `/${md5(this.user.email).toString()}`;
      return `https://cdn.v2ex.com/gravatar/avatar${
        this.user.email ? mailUrl : ""
      }?s=128`;
    },
  },
  methods: {
    handleLogout() {
      this.$auth.authToken = null;
      this.$auth.refreshToken = null;
      window.localStorage.removeItem('cloud-auth');
      this.$message.success('登出成功');
      this.$router.push('/mobile/landing');
      this.$emit('close');
    },
  },
};
</script>
