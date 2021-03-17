<template>
  <div class="mobile-menu-item mobile-menu-category" @click="handleCategoryClick">
    <span class="mobile-menu-category__name">{{
      processCategoryName(category.name)
    }}</span>
    <span class="mobile-menu-category__count">{{ category.count }}</span>
  </div>
</template>

<script>
export default {
  props: {
    category: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    processCategoryName(name) {
      if (name === "all") {
        return "所有便签";
      } else if (name === "notalloc") {
        return "未分类";
      }
      return name;
    },
    handleCategoryClick() {
      this.$bus.$emit('change-category', this.category.name);
      this.$bus.$emit('close-mobile-menu');
    },
  },
};
</script>
