<template>
  <li class="categories-list-item categories-add" @click="handleClick">
    <div class="categories-add-plus" v-if="!inputMode">
      <i class="fa fa-plus"></i>
    </div>
    <div class="categories-add-inner" v-else>
      <div class="categories-add-inner__input">
        <input @keydown="handleKeydown" v-model="value">
      </div>
      <div class="categories-add-inner__icon">
        <i class="fa fa-times" @mouseup="handleCancelClick"></i>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  data() {
    return {
      inputMode: false,
      value: '',
    };
  },
  created() {
    this.listenEvents('on');
  },
  beforeDestroy() {
    this.listenEvents('off');
  },
  methods: {
    listenEvents(op) {
      this.$bus[`\$${op}`]('category-added', this.handleCancelClick);
    },
    handleClick() {
      this.inputMode = true;
    },
    handleKeydown(e) {
      if (e.code === 'Enter') {
        if (!this.value) {
          this.handleCancelClick();
          return;
        }
        this.$bus.$emit('add-category', this.value);
      }
    },
    handleCancelClick() {
      this.inputMode = false;
      this.value = '';
    },
  },
}
</script>