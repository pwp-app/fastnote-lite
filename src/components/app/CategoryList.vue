<template>
  <div class="categories">
    <div class="categories-header">
      <span>便签分类</span>
    </div>
    <ul class="categories-list">
      <CategoryItem
        v-for="category in categories"
        :key="category.name"
        :category="category"
        :currentCategory="currentCategory"
        />
      <CategoryAddButton />
    </ul>
  </div>
</template>

<script>
import CategoryAddButton from './CategoryAddButton';
import CategoryItem from './CategoryItem';

export default {
  props: {
    categories: {
      type: Array,
      default: () => [],
    },
    currentCategory: {
      type: String,
      default: '',
    }
  },
  components: {
    CategoryAddButton,
    CategoryItem,
  }
}
</script>