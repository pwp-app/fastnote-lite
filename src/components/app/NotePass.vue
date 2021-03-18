<template>
  <div class="note-pass">
    <el-input v-model="password" type="password" size="small" />
    <el-button size="small" round @click="handleUnlock">解锁</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      password: '',
    };
  },
  methods: {
    handleUnlock() {
      if (!this.password) {
        this.$message.error('请输入密码');
        return;
      }
      this.$emit('unlock', this.password);
    },
  },
};
</script>