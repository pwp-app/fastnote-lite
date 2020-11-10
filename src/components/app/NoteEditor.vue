<template>
  <div class="note-editor" v-if="!collapsed">
    <div class="note-editor-header">
      <span>新建便签</span>
      <div class="note-editor-header-ctrl">
        <i class="fa fa-caret-down" @mouseup="handleHideClick"></i>
      </div>
    </div>
    <div class="note-editor-main">
      <textarea id="zone" v-model="text" @keydown="handleKeyDown"></textarea>
    </div>
  </div>
  <div class="note-editor-collapsed" v-else>
    <div class="note-editor-collapsed__ctrl">
      <i class="fa fa-caret-up" @mouseup="handleShowClick"></i>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      collapsed: false,
      text: '',
    };
  },
  created() {
    this.listenEvents('on');
  },
  beforeDestroy() {
    this.listenEvents('off');
  },
  methods: {
    // func
    listenEvents(op) {
      this.$bus[`\$${op}`]('note-added', this.handleNoteAdded);
    },
    // events
    handleKeyDown(e) {
      if (e.ctrlKey && e.code === 'Enter') {
        this.$bus.$emit('add-note', this.text);
      }
    },
    handleShowClick() {
      const el = document.getElementsByClassName('note-editor-collapsed')[0];
      el.setAttribute('class', 'note-editor-collapsed animated fadeOutDown faster');
      setTimeout(() => {
        this.collapsed = false;
        this.$nextTick(() => {
          const el = document.getElementsByClassName('note-editor')[0];
          el.setAttribute('class', 'note-editor animated fadeInUp faster');
          this.$bus.$emit('editor-expand');
        });
      }, 500);
    },
    handleHideClick() {
      const el = document.getElementsByClassName('note-editor')[0];
      el.setAttribute('class', 'note-editor animated fadeOutDown faster');
      setTimeout(() => {
        this.collapsed = true;
        this.$nextTick(() => {
          const el = document.getElementsByClassName('note-editor-collapsed')[0];
          el.setAttribute('class', 'note-editor-collapsed animated fadeInUp faster');
          this.$bus.$emit('editor-collapse');
        });
      }, 500);
    },
    handleNoteAdded(noteId) {
      this.$message.success('便签已添加');
      this.text = '';
    }
  },
}
</script>