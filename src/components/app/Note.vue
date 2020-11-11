<template>
  <div :class="{
    'note-wrapper': true,
    'note-wrapper__selected': selected,
    'animated fadeInLeft faster': note.isNew,
    }"
    @contextmenu.prevent="openMenu"
    >
    <div
      :id="`note-${note.id}`"
      class="note"
      :data-id="note.id"
      :data-category="note.category"
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
      <div class="note-content">
        <p class="note-text" v-html="displayText"></p>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

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
      let { text } = this.note;
      text = text.replace(/\r?\n/g, '<br>');
      return text;
    },
  },
  created() {
    this.listenEvents('on');
  },
  beforeDestroy() {
    this.listenEvents('off');
  },
  methods: {
    listenEvents(op) {
      this.$bus[`\$${op}`]('note-context-close', this.handleContextClose);
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
    handleContextClose() {
      this.selected = false;
    }
  },
}
</script>