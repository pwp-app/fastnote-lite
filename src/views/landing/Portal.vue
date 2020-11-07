<template>
  <section class="landing-main landing-portal">
    <div class="landing-portal-wrapper" v-if="usable">
      <PortalForm />
    </div>
    <div class="landing-portal-wrapper" v-else>
      <div class="portal-disabled">
        <div class="portal-disabled-logo">
          <img :src="logo">
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
    };
  },
  async created() {
    this.usable = await this.ping();
  },
  methods: {
    async ping() {
      let ret = true;
      try {
        const res = await this.axios.get(`${this.API_BASE}/common/ping`);
        if (res.status !== 200 || !res.data || !res.data.success) {
          ret = false;
        }
      } catch (err) {
        ret = false;
      }
      return ret;
    }
  },
}
</script>
