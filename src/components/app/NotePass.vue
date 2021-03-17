<template>
  <div class="note-pass">
    <span style="font-size: 15px;">【该便签已加密，Fastnote Lite 暂时不支持加密便签】</span>
    <!-- <el-input v-model="password" />
    <el-button type="primary" size="small" round>解锁</el-button> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      password: '',
    };
  },
}
</script>