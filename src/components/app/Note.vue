<template>
  <div
    :id="`note-wrapper-${note.id}`"
    :class="{
      'note-wrapper': true,
      'note-wrapper__selected': selected,
    }"
    @contextmenu.prevent="openMenu"
    >
    <div
      :id="`note-${note.id}`"
      :class="{
        'note': true,
        'note-overheight': isOverHeight && !expanded,
      }"
      ref="note"
      :data-id="note.id"
      :data-category="note.category"
      @dblclick="handleNoteDblClick"
      >
      <div class="note-header">
        <span class="note-no">#{{note.id}}</span>
        <span class="note-title">{{note.title}}</span>
        <span
          :class="{
            'note-time': true,
            'note-time__clickable': timePrefix ? true: false,
          }"
          @click="handleTimeClick"
        >{{timePrefix}}{{displayTime}}</span>
      </div>
      <div class="note-content" :style="`max-height: ${maxHeight}px;`">
        <p class="note-text" ref="text" v-html="displayText"></p>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import marked from 'marked';

const HEIGHT_LIMIT = 240;

export default {
  props: {
    note: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      selected: false,
      timeType: 'create',
      isOverHeight: false,
      expanded: false,
      maxHeight: '100vh',
    };
  },
  computed: {
    showTimePrefix() {
      return this.note.updaterawtime ? true : false;
    },
    timePrefix() {
      if (!this.showTimePrefix) {
        return '';
      }
      return this.timeType === 'create' ? '创建：' : '更新：';
    },
    displayTime() {
      if (this.timeType === 'create') {
        return moment(this.note.rawtime, 'YYYYMMDDHHmmss').format('YYYY年MM月DD日 HH:mm:ss');
      } else {
        return moment(this.note.updaterawtime, 'YYYYMMDDHHmmss').format('YYYY年MM月DD日 HH:mm:ss');
      }
    },
    displayText() {
      let text;
      if (!this.note.markdown) {
        text = this.note.text.replace(/\r?\n/g, '<br>');
      } else {
        text = marked(this.note.text);
      }
      return text;
    },
  },
  created() {
    this.listenEvents('on');
  },
  mounted() {
    this.checkIsOverHeight();
  },
  beforeDestroy() {
    this.listenEvents('off');
  },
  methods: {
    listenEvents(op) {
      this.$bus[`\$${op}`]('note-context-close', this.handleContextClose);
      this.$bus[`\$${op}`]('window-resized', this.handleWindowResized);
    },
    handleTimeClick() {
      if (!this.showTimePrefix) {
        return;
      }
      if (this.timeType === 'create') {
        this.timeType = 'update';
        return;
      }
      this.timeType = 'create';
    },
    openMenu(e) {
      this.$bus.$emit('note-context-open', {
        x: e.pageX,
        y: e.pageY,
        noteId: this.note.id,
      });
      this.selected = true;
    },
    checkIsOverHeight() {
      this.maxHeight = this.$refs.text.clientHeight;
      this.isOverHeight = this.$refs.note.clientHeight > HEIGHT_LIMIT;
    },
    handleNoteDblClick() {
      if (!this.isOverHeight) {
        return;
      }
      this.expanded = !this.expanded;
    },
    handleContextClose() {
      this.selected = false;
    },
    handleWindowResized() {
      this.checkIsOverHeight();
    }
  },
}
</script>