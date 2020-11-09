<template>
  <li
    :class="{
      'categories-list-item': true,
      'categories-list-item__selected': isSelected
    }"
    @click="handleClick"
    >
    <div class="categories-list-item__name">
      <span>{{displayName}}</span>
    </div>
    <div class="categories-list-item__count">
      <span>{{displayCount}}</span>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    category: {
      type: Object,
      default: {},
    },
    currentCategory: {
      type: String,
      default: '',
    },
  },
  computed: {
    displayName() {
      const { category } = this;
      if (category.name === 'all') {
        return '所有便签';
      }
      if (category.name === 'notalloc') {
        return '未分配';
      }
      return category.name;
    },
    displayCount() {
      const { category } = this;
      return category.count || 0;
    },
    isSelected() {
      const { category, currentCategory } = this;
      if (category.name === 'all' && !currentCategory) {
        return true;
      }
      return category.name === currentCategory;
    },
  },
  methods: {
    // events
    handleClick() {
      this.$bus.$emit('change-category', this.category.name);
    },
  },
}
</script>