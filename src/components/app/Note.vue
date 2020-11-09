<template>
  <div class="note-wrapper">
    <div
      :id="`note-${note.id}`"
      class="note"
      :data-id="note.id"
      :data-category="note.category"
      >
      <div class="note-header">
        <span class="note-no">#{{note.id}}</span>
        <span class="note-title">{{note.title}}</span>
        <span class="note-time">{{timePrefix}}{{displayTime}}</span>
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
      return this.timeType === 'create' ? '创建日期：' : '更新日期：';
    },
    displayTime() {
      if (this.timeType === 'create') {
        return moment(this.note.rawtime, 'YYYYMMDDHHmmss').format('YYYY 年 MM 月 DD 日 HH:mm:ss');
      } else {
        return moment(this.note.updaterawtime, 'YYYYMMDDHHmmss').format('YYYY 年 MM 月 DD 日 HH:mm:ss');
      }
    },
    displayText() {
      return this.note.text;
    }
  }
}
</script>