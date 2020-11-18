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
      if (this.category.name === 'all') {
        return '所有便签';
      }
      if (this.category.name === 'notalloc') {
        return '未分配';
      }
      return this.category.name;
    },
    displayCount() {
      return this.category.count || 0;
    },
    isSelected() {
      if (this.category.name === 'all' && !this.currentCategory) {
        return true;
      }
      return this.category.name === this.currentCategory;
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