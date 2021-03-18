<template>
  <div
    :id="`note-${note.id}`"
    :class="{
      note: true,
      'note-overheight': isOverHeight && !expanded,
    }"
    ref="note"
    :data-id="note.id"
    :data-category="note.category"
    @dblclick="handleNoteDblClick"
  >
    <div class="note-header">
      <span class="note-no">#{{ note.id }}</span>
      <span class="note-title">{{ note.title }}</span>
      <span
        :class="{
          'note-time': true,
          'note-time__clickable': timePrefix ? true : false,
        }"
        @click="handleTimeClick"
      >
        {{ timePrefix }}{{ displayTime }}
      </span>
    </div>
    <div class="note-content" :style="`max-height: ${maxHeight}px;`">
      <NotePass v-if="showNotePass" @unlock="handleUnlock" />
      <p class="note-text" ref="text" v-html="displayText" v-else></p>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import marked from "marked";
import escapeHtml from "escape-html";
import hmacSha256 from 'crypto-js/hmac-sha256';
import { createDecipheriv } from 'browserify-aes';
import { Buffer } from 'safe-buffer';

import NotePass from './NotePass';

const HEIGHT_LIMIT = 240;

export default {
  props: {
    note: Object,
  },
  components: {
    NotePass,
  },
  data() {
    return {
      timeType: "create",
      isOverHeight: false,
      expanded: false,
      maxHeight: "100vh",
      // encrypt
      decrypted: false,
      decryptedText: '',
    };
  },
  computed: {
    showTimePrefix() {
      return !!this.note.updaterawtime;
    },
    timePrefix() {
      if (!this.showTimePrefix) {
        return "";
      }
      return this.timeType === "create" ? "创建：" : "更新：";
    },
    displayTime() {
      if (this.timeType === "create") {
        return moment(this.note.rawtime, "YYYYMMDDHHmmss").format(
          "YYYY年MM月DD日 HH:mm:ss"
        );
      } else {
        return moment(this.note.updaterawtime, "YYYYMMDDHHmmss").format(
          "YYYY年MM月DD日 HH:mm:ss"
        );
      }
    },
    displayText() {
      let text;
      if (this.note.password && this.decrypted) {
        text = this.decryptedText;
      } else {
        text = this.note.text;
      }
      let content;
      if (!this.note.markdown) {
        content = escapeHtml(text).replace(/\r?\n/g, "<br/>");
      } else {
        content = marked(text, {
          gfm: true,
        });
      }
      return content;
    },
    showNotePass() {
      return this.note.password && !this.decrypted;
    },
  },
  created() {
    this.listenEvents("on");
  },
  beforeDestroy() {
    this.listenEvents("off");
  },
  mounted() {
    this.checkIsOverHeight();
  },
  methods: {
    listenEvents(op) {
      this.$bus[`\$${op}`]("window-resized", this.handleWindowResized);
    },
    handleTimeClick() {
      if (!this.showTimePrefix) {
        return;
      }
      if (this.timeType === "create") {
        this.timeType = "update";
        return;
      }
      this.timeType = "create";
    },
    handleNoteDblClick() {
      if (!this.isOverHeight) {
        return;
      }
      this.expanded = !this.expanded;
    },
    handleWindowResized() {
      this.checkIsOverHeight();
    },
    checkIsOverHeight() {
      if (!this.$refs.text || !this.$refs.note) {
        return;
      }
      this.maxHeight = this.$refs.text.clientHeight;
      this.isOverHeight = this.$refs.note.clientHeight > HEIGHT_LIMIT;
    },
    async handleUnlock(password) {
      if (hmacSha256(password, 'fastnote').toString() !== this.note.password) {
        this.$message.error('密码错误');
        return;
      }
      const scrypt = await import('scrypt-wasm');
      const secret = scrypt.scrypt(Buffer.from(password, 'utf8').toString('hex'), Buffer.from('3bdc83600356a16ed2966991d9ee67e29ca2f25b', 'utf8').toString('hex'), 16384, 8, 1, 32);
      const decipher = createDecipheriv('aes-256-cfb', Buffer.from(secret, 'hex'), Buffer.alloc(16, 0));
      let decrypted = decipher.update(this.note.text, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      this.decrypted = true;
      this.decryptedText = decrypted;
      this.$emit('decrypted');
    }
  }
};
</script>
