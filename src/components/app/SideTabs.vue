<template>
  <div class="app-aside-tabs-wrapper">
    <div class="app-aside-tab">
      <div :class="{
        'app-aside-tabs-item': true,
        'app-aside-tabs-item__selected': currentTab === 'category'
      }">
        <i class="fa fa-book"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentTab: String,
  }
}
</script>