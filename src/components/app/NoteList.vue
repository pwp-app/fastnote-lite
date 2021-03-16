<template>
  <div class="note-list" v-if="showList">
    <Note
      v-for="note in notes"
      :key="note.id"
      :note="note"
      />
    <ContextMenu
      :show="showContextMenu"
      :position="contextMenuPosition"
      @close="handleContextMenuClose"
      >
      <div class="context-menu-item" @mousedown="handleCopy">
        <span>复制内容</span>
      </div>
      <div class="context-menu-item" @mousedown="handleDelete">
        <span>删除</span>
      </div>
    </ContextMenu>
    <infinite-loading
      :identifier="identifier"
      @infinite="handleLoad"
      spinner="spiral"
    >
      <span slot="no-more" style="display: none !important"></span>
      <span slot="no-results" style="display: none !important"></span>
    </infinite-loading>
  </div>
  <div class="note-list note-empty" v-else>
    <div class="note-empty-inner" v-if="!isCategory">
      <p>您还没有建立任何的便签</p>
      <p>在下方你可以快速创建便签</p>
    </div>
    <div class="note-empty-inner" v-if="isCategory">
      <p>当前分类下没有任何便签</p>
      <p>在下方你可以快速创建该分类的便签</p>
    </div>
  </div>
</template>

<script>
import Note from './Note';
import ContextMenu from './ContextMenu';

export default {
  props: {
    notes: Array,
    isCategory: Boolean,
    identifier: Number,
  },
  components: {
    Note,
    ContextMenu,
  },
  data() {
    return {
      showContextMenu: false,
      contextMenuPosition: {},
      // selected
      selectedNote: null,
    };
  },
  created() {
    this.listenEvents('on');
  },
  beforeDestroy() {
    this.listenEvents('off');
  },
  computed: {
    showList() {
      return this.notes.length > 0;
    },
  },
  methods: {
    listenEvents(op) {
      this.$bus[`\$${op}`]('note-context-open', this.handleContextOpen);
    },
    handleContextOpen(data) {
      const { x, y, noteId } = data;
      this.selectedNote = noteId;
      this.showContextMenu = true;
      this.contextMenuPosition = { x, y };
      window.fastnote.noteContextOpened = true;
    },
    handleContextMenuClose() {
      this.showContextMenu = false;
      this.selectedNote = null;
      this.$bus.$emit('note-context-close');
      window.fastnote.noteContextOpened = false;
    },
    // context events
    handleLoad(state) {
      this.$emit('load', state);
    },
    handleDelete() {
      this.$bus.$emit('delete-note', { noteId: this.selectedNote });
    },
    handleCopy() {
      this.$bus.$emit('copy-note', { noteId: this.selectedNote });
    },
  }
}
</script>