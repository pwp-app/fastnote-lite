<template>
  <div class="mobile-portal-wrapper">
    <div class="mobile-portal mobile-portal-pinging" v-if="pinging">
      <van-loading size="24px" vertical color="#1faeff">
        正在检查服务状态...
      </van-loading>
    </div>
    <div class="mobile-portal" v-if="!pinging && usable">
      <PortalForm />
    </div>
    <div class="mobile-portal mobile-portal-disabled" v-if="!pinging && !usable">
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
    };
  },
  async created() {
    this.pinging = true;
    this.usable = await this.$pingCloud();
    this.pinging = false;
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>
