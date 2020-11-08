<template>
  <div class="portal-form">
    <el-form
      ref="loginForm"
      class="portal-form-body"
      :model="loginForm"
      label-width="120px"
      v-show="showLoginForm"
      :rules="rules.login"
    >
      <el-form-item>
        <div class="portal-form-header">
          <span>{{ headerTitle }}</span>
        </div>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="loginForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="loginForm.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="captcha" v-if="loginForm.needCaptcha">
        <el-input v-model="loginForm.captcha"></el-input>
        <img
          :src="loginForm.captchaSrc"
          @click.prevent="refreshCaptcha('login')"
        />
      </el-form-item>
      <el-form-item class="portal-form-button">
        <div class="el-input">
          <el-button type="primary" :disabled="registerForm.btnDisabled" @click="submitLogin">登录</el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="el-input">
          <span class="portal-form-tip" @click="switchType('register')">没有帐户？</span>
        </div>
      </el-form-item>
    </el-form>
    <el-form
      ref="registerForm"
      class="portal-form-body"
      :model="registerForm"
      label-width="120px"
      v-show="!showLoginForm"
      :rules="rules.register"
    >
      <el-form-item>
        <div class="portal-form-header">
          <span>{{ headerTitle }}</span>
        </div>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="registerForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="registerForm.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          v-model="registerForm.confirmPassword"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="registerForm.email"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="captcha">
        <el-input v-model="registerForm.captcha"></el-input>
        <img
          :src="registerForm.captchaSrc"
          @click.prevent="refreshCaptcha('register')"
        />
      </el-form-item>
      <el-form-item label="邮箱验证码" prop="emailCaptcha">
        <el-input v-model="registerForm.emailCaptcha"></el-input>
        <CountButton ref="sendButton" text="发送" :count="60" @click="submitSendMail"/>
      </el-form-item>
      <el-form-item>
        <div class="el-input">
          <el-button type="primary" :disabled="registerForm.btnDisabled" @click="submitRegister">注册</el-button>
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
import hmacSha256 from 'crypto-js/hmac-sha256';
import CountButton from "./CountButton";
import moment from 'moment';

export default {
  data() {
    // 校验器
    const checkLoginCaptcha = (rule, value, callback) => {
      if (!this.loginForm.needCaptcha) {
        callback();
        return;
      }
      if (!this.loginForm.captcha) {
        callback(new Error('请输入验证码'));
        return;
      }
      if (this.loginForm.captcha.length !== 4) {
        callback(new Error('验证码为4个字符'));
        return;
      }
      callback();
    };
    const checkConfirmPassword = (rule, value, callback) => {
      if (!this.registerForm.confirmPassword) {
        callback(new Error('请再次输入密码'));
        return;
      }
      if (this.registerForm.password !== this.registerForm.confirmPassword) {
        callback(new Error('两次输入的密码不一致'));
        return;
      }
      callback();
    };
    return {
      type: 'login',
      loginForm: {
        username: '',
        password: '',
        captcha: '',
        captchaId: null,
        captchaSrc: '',
        needCaptcha: false,
        btnDisabled: false,
      },
      registerForm: {
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        captcha: '',
        captchaId: null,
        captchaSrc: '',
        emailCaptcha: '',
        btnDisabled: false,
      },
      rules: {
        login: {
          username: [
            { required: true, message: '请输入用户名' },
            { min: 4, max: 30, message: '用户名限 5 - 30 字符'}
          ],
          password: [
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码不能少于6个字符' },
          ],
          captcha: [
            { required: false },
            { validator: checkLoginCaptcha },
          ],
        },
        register: {
          username: [
            { required: true, message: '请输入用户名' },
            { min: 4, max: 30, message: '用户名限 5 - 30 字符'}
          ],
          password: [
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码不能少于6个字符' },
          ],
          confirmPassword: [
            { validator: checkConfirmPassword },
          ],
          email: [
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '输入的邮箱有误' },
          ],
          emailCaptcha: [
            { required: true, message: '请输入邮箱验证码' },
            { min: 6, max: 6, message: '输入的邮箱验证码有误' },
          ],
        },
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
      const res = await this.axios.get(`${this.API_BASE}/common/captcha`);
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
    async validateForm(type) {
      return new Promise((resolve) => {
        this.$refs[`${type}Form`].validate((valid) => {
          if (!valid) {
            return resolve(false);
          }
          resolve(true);
        });
      });
    },
    async submitLogin() {
      const valid = await this.validateForm('login');
      if (!valid) {
        return;
      }
      // 构造验证码信息
      const captchaInfo = this.loginForm.needCaptcha ? {
        captchId: this.loginForm.captchaId,
        captcha: this.loginForm.captcha,
      } : null;
      // 提交登录
      let res;
      try {
        res = await this.axios.post(`${this.API_BASE}/user/login`, {
          username: this.loginForm.username,
          password: hmacSha256(this.loginForm.password, 'fastnote').toString(),
          ...captchaInfo,
        });
      } catch (err) {
        console.error('Submit login error: ', err);
        this.refreshCaptcha('login');
        this.$message.error('提交登录时发生错误');
        return;
      }
      // 结果
      const { data: ret } = res;
      const { code, success } = ret;
      if (!success) {
        if (ret.code === 400009) {
          this.loginForm.needCaptcha = true;
        }
        this.refreshCaptcha('login');
        this.$message.error(ret.message);
        return;
      }
      // 登录成功
      this.$message.success('登录成功');
      // 保存auth信息
      const { data: authData } = ret;
      authData.fetchTime = moment().format('YYYYMMDDHHmmss');
      const { authToken, refreshToken } = authData;
      this.$auth.authToken = authToken;
      this.$auth.refreshToken = refreshToken;
      window.localStorage.setItem('cloud-auth', JSON.stringify(authData));
      // 跳转
      this.$router.push('/app');
    },
    async submitSendMail() {
      let res;
      try {
        res = await this.axios.post(`${this.API_BASE}/user/sendMail`, {
          email: this.registerForm.email,
          captchaId: this.registerForm.captchaId,
          captcha: this.registerForm.captcha,
        });
      } catch (err) {
        console.error('Submit send mail eror: ', err);
        this.$message.error('提交发送请求时发生错误');
        this.$refs.sendButton.disabled = false;
        return;
      }
      const { data: ret } = res;
      const { success } = ret;
      if (!success) {
        this.$message.error(ret.message);
        this.$refs.sendButton.disabled = false;
        return;
      }
      // 发送成功
      this.$message.success('发送成功，请到您的邮箱查收验证码');
      this.$refs.sendButton.startCount();
      return;
    },
    async submitRegister() {
      const valid = await this.validateForm('register');
      if (!valid) {
        return;
      }
      // 提交注册
      let res;
      try {
        res = await this.axios.post(`${this.API_BASE}/user/register`, {
          username: this.registerForm.username,
          password: hmacSha256(this.registerForm.password, 'fastnote').toString(),
          confirmPassword: hmacSha256(this.registerForm.confirmPassword, 'fastnote').toString(),
          email: this.registerForm.email,
          emailCaptcha: this.registerForm.emailCaptcha,
        });
      } catch (err) {
        console.error('Submit register error: ', err);
        this.$message.error('提交注册请求时发生错误');
        return;
      }
      const { data: ret } = res;
      const { success } = ret;
      if (!success) {
        this.$message.error(ret.message);
        return;
      }
      // 注册成功
      this.$message.success('注册成功');
      this.switchType('login');
      this.loginForm.username = this.registerForm.username;
    }
  },
};
</script>
