<template>
  <div class="mobile-ne">
    <textarea id="zone" v-model="text" :style="editorStyle"></textarea>
    <i class="el-icon-s-promotion" @click="handleAdd" v-if="!sending"></i>
    <van-loading color="#1faeff" v-else />
  </div>
</template>

<script>
const MAX_ROW = 8;

export default {
  data() {
    return {
      text: '',
      sending: false,
    };
  },
  created() {
    this.listenEvents('on');
  },
  beforeDestroy() {
    this.listenEvents('off');
  },
  computed: {
    row() {
      return [...this.text.matchAll(/\n/g)].length + 1;
    },
    editorStyle() {
      if (this.row <= MAX_ROW) {
        return `height: ${this.row * 30 + 6}px;`;
      } else {
        return `height: ${MAX_ROW * 30 + 6}px; overflow-y: auto;`;
      }
    },
  },
  methods: {
    listenEvents(op) {
      this.$bus[`\$${op}`]('note-add-failed', this.handleNoteAddFailed);
      this.$bus[`\$${op}`]('note-added', this.handleNoteAdded);
    },
    handleAdd() {
      this.$bus.$emit('add-note', this.text);
      this.sending = true;
    },
    handleNoteAddFailed() {
      this.sending = false;
    },
    handleNoteAdded() {
      this.$message.success('便签已添加');
      this.text = '';
      this.sending = false;
    },
  }
}
</script>
