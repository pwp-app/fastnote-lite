<template>
  <section class="landing-main landing-unavailable">
    <div class="landing-unavailable-wrapper">
      <div class="landing-unavailable-logo">
        <img :src="logo" />
      </div>
      <div class="landing-unavailable-text">
        <p>很抱歉</p>
        <p>Fastnote 暂时不支持您的设备</p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Landing.Unavailable",
  data() {
    return {
      logo: require("@/assets/images/logo.png"),
    };
  },
};
</script>
