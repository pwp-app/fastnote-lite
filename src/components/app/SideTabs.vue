<template>
  <div class="app-aside-tabs-wrapper">
    <div class="app-aside-tabs" @click="handleTabClick">
      <div :class="{
        'app-aside-tabs-item': true,
        'app-aside-tabs-item__selected': currentTab === 'category'
      }" data-tab="category">
        <i class="fa fa-book" data-tab="category"></i>
      </div>
      <div :class="{
        'app-aside-tabs-item': true,
        'app-aside-tabs-item__selected': currentTab === 'user'
      }" data-tab="user">
        <i class="fa fa-user" data-tab="user"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentTab: String,
  },
  methods: {
    handleTabClick(e) {
      if (!e.target.dataset.tab) {
        return;
      }
      this.$bus.$emit('change-tab', e.target.dataset.tab);
    }
  }
}
</script>