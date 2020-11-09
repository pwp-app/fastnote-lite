<template>
  <div class="note-list" v-if="notes.length > 0">
    <Note
      v-for="note in notes"
      :key="note.id"
      :note="note"
      />
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

export default {
  props: {
    notes: Array,
    isCategory: Boolean
  },
  components: {
    Note,
  },
}
</script>