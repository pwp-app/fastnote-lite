<template>
  <div class="mobile-landing">
    <div class="mobile-landing-logo">
      <img :src="logo">
      <p>Fastnote</p>
    </div>
    <div class="mobile-landing-desc">
      <span>全新交互，高效体验</span>
    </div>
    <Note :note="virtualNote" />
    <div class="mobile-landing-go">
      <el-button type="primary" round @click="goPortal">点我立刻体验</el-button>
    </div>
    <div class="mobile-landing-footer">
      <span>Copyright &copy; 2021 pwp.app</span>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import Note from '../../components/app/Note';

export default {
  name: 'Mobile.Landing',
  components: {
    Note,
  },
  data() {
    return {
      logo: require('@/assets/images/logo.png'),
      virtualNote: {
        id: 1,
        markdown: false,
        forceTop: false,
        rawtime: moment().format('YYYYMMDDHHmmss'),
        text: '快来新建一个便签吧！',
      },
    };
  },
  methods: {
    goPortal() {
      this.$router.push('/mobile/portal');
    },
  },
}
</script>