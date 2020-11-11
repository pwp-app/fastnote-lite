<template>
  <div class="note-list" v-if="notes.length > 0">
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
      <div class="context-menu-item">
        <span>复制内容</span>
      </div>
      <div class="context-menu-item">
        <span>删除</span>
      </div>
    </ContextMenu>
  </div>
  <div class="note-list note-empty" v-else>
    <div class="note-empty-inner" v-if="!isCategory">
      <p>您还没有建立任何的便签</p>
      <p>在下方你可以快速创建便签</p>
    </div>
    <div class="note-empty-inner" v-else>
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
    isCategory: Boolean
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
  methods: {
    listenEvents(op) {
      this.$bus[`\$${op}`]('note-context-open', this.handleContextOpen);
    },
    handleContextOpen(data) {
      const { x, y, noteId } = data;
      this.selectedNote = noteId;
      this.showContextMenu = true;
      this.contextMenuPosition = { x, y };
    },
    handleContextMenuClose() {
      this.showContextMenu = false;
      this.selectedNote = null;
      this.$bus.$emit('note-context-close');
    }
  }
}
</script>