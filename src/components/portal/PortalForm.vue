<template>
  <div class="portal-form">
    <el-form
      class="portal-form-body"
      :model="loginForm"
      label-width="120px"
      v-if="showLoginForm"
    >
      <el-form-item>
        <div class="portal-form-header">
          <span>{{ headerTitle }}</span>
        </div>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="loginForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="loginForm.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="验证码" v-if="loginForm.needCaptcha">
        <el-input v-model="loginForm.captcha"></el-input>
        <img
          :src="loginForm.captchaSrc"
          @click.prevent="refreshCaptcha('login')"
        />
      </el-form-item>
      <el-form-item class="portal-form-button">
        <div class="el-input">
          <el-button type="primary">登录</el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="el-input">
          <span class="portal-form-tip" @click="switchType('register')">没有帐户？</span>
        </div>
      </el-form-item>
    </el-form>
    <el-form
      class="portal-form-body"
      :model="registerForm"
      label-width="120px"
      v-else
    >
      <el-form-item>
        <div class="portal-form-header">
          <span>{{ headerTitle }}</span>
        </div>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="registerForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="registerForm.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input
          v-model="registerForm.confirmPassword"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="registerForm.email"></el-input>
      </el-form-item>
      <el-form-item label="验证码">
        <el-input v-model="registerForm.captcha"></el-input>
        <img
          :src="registerForm.captchaSrc"
          @click.prevent="refreshCaptcha('register')"
        />
      </el-form-item>
      <el-form-item label="邮箱验证码">
        <el-input v-model="registerForm.emailCaptcha"></el-input>
        <CountButton text="发送" :count="60" />
      </el-form-item>
      <el-form-item>
        <div class="el-input">
          <el-button type="primary">注册</el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="el-input">
          <span class="portal-form-tip" @click="switchType('login')">已有帐户？</span>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import CountButton from "./CountButton";

export default {
  data() {
    return {
      type: "login",
      loginForm: {
        username: "",
        password: "",
        captcha: "",
        captchaId: null,
        captchaSrc: "",
        needCaptcha: false,
      },
      registerForm: {
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        captcha: "",
        captchaId: null,
        captchaSrc: "",
        emailCaptcha: "",
      },
    };
  },
  components: {
    CountButton,
  },
  computed: {
    headerTitle() {
      return this.type === "login"
        ? "登录到 Fastnote Lite"
        : "注册 Fastnote Cloud 帐户";
    },
    showLoginForm() {
      return this.type === "login";
    },
  },
  methods: {
    switchType(type) {
      this.type = type;
      this.refreshCaptcha(type);
    },
    async getCaptcha() {
      const res = await this.axios.get(`${this.API_BASE}/common/captcha`, {
        withCredentials: false,
      });
      const { data: ret } = res;
      const { success, data } = ret;
      if (!success) {
        this.$message.error("验证码获取失败");
        return null;
      }
      return data;
    },
    async refreshCaptcha(type) {
      const captcha = await this.getCaptcha();
      if (!captcha) {
        return;
      }
      const { uuid, captcha: captchaImg } = captcha;
      this[`${type}Form`].captchaId = uuid;
      this[`${type}Form`].captchaSrc = `data:image/png;base64,${captchaImg}`;
    },
  },
};
</script>
