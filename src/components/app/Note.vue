<template>
  <!-- Mobile -->
  <van-swipe-cell v-if="isMobile && !isDemo">
    <template #left>
      <div class="note-swipe__wrapper">
        <div class="note-swipe note-swipe__copy" @click="handleCopy">复制</div>
      </div>
    </template>
    <div :id="`note-wrapper-${note.id}`" class="note-wrapper">
      <NoteContent :note="note" />
    </div>
    <template #right>
      <div class="note-swipe__wrapper">
        <div class="note-swipe note-swipe__delete" @click="handleDelete">删除</div>
      </div>
    </template>
  </van-swipe-cell>
  <!-- PC -->
  <div
    :id="`note-wrapper-${note.id}`"
    :class="{
      'note-wrapper': true,
      'note-wrapper__selected': selected,
    }"
    @contextmenu.prevent="openMenu"
    v-else
  >
    <NoteContent :note="note" />
  </div>
</template>

<script>
import { Dialog } from 'vant';

import NoteContent from './NoteContent';

export default {
  props: {
    note: {
      type: Object,
      default: null,
    },
    isDemo: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    NoteContent,
  },
  data() {
    return {
      selected: false,
      isMobile: window.os.isMobile,
    };
  },
  created() {
    this.listenEvents("on");
  },
  beforeDestroy() {
    this.listenEvents("off");
  },
  methods: {
    listenEvents(op) {
      this.$bus[`\$${op}`]("note-context-close", this.handleContextClose);
    },
    openMenu(e) {
      this.$bus.$emit("note-context-open", {
        x: e.pageX,
        y: e.pageY,
        noteId: this.note.id,
      });
      this.selected = true;
    },
    handleContextClose() {
      this.selected = false;
    },
    handleDelete() {
      Dialog.confirm({
        title: '确认要删除吗？',
        message: `确定要删除 #${this.note.id}${this.note.title ? ` ${this.note.title}` : ''} 吗？`,
      }).then(() => {
        this.$bus.$emit('delete-note', { noteId: this.note.id });
      }).catch(() => {});
    },
    handleCopy() {
      this.$bus.$emit('copy-note', { noteId: this.note.id });
    },
  },
};
</script>