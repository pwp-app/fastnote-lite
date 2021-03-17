<template>
  <div
    :class="{
      app: true,
      'app-mobile': isMobile,
    }"
  >
    <div class="app-aside" v-if="!isMobile">
      <div class="app-aside-content">
        <CategoryList
          v-show="currentTab === 'category'"
          :categories="categories"
          :currentCategory="currentCategory"
        />
        <UserPanel :user="user" v-show="currentTab === 'user'" />
      </div>
      <SideTabs :currentTab="currentTab" />
    </div>
    <div class="app-main">
      <MobileNav :title="mobileNavTitle" v-if="isMobile" />
      <div class="app-main-top app-main-loading" v-if="fetching">
        <van-loading size="24px" vertical color="#1faeff">
          正在获取数据...
        </van-loading>
      </div>
      <div class="app-main-top" v-if="!fetching">
        <NoteList
          :identifier="listId"
          :notes="displayNotes"
          :isCategory="isCategory"
          @load="fetchList"
        />
      </div>
      <div
        :class="{
          'app-main-bottom': true,
          'app-main-bottom__collapsed': editorCollapsed,
        }"
        v-if="!isMobile"
      >
        <NoteEditor />
      </div>
      <div class="app-main-bottom-mobile" v-else>
        <MobileNoteEditor />
      </div>
    </div>
    <van-popup
      v-model="showMobileMenu"
      v-if="isMobile"
      position="left"
      :style="{ width: '80%' }"
    >
      <MobileMenu
        :user="user"
        :categories="categories"
        :currentCategory="currentCategory"
        @close="handleMobileMenuClose"
      />
    </van-popup>
  </div>
</template>

<script>
import NoteList from "../../components/app/NoteList";
import NoteEditor from "../../components/app/NoteEditor";
import CategoryList from "../../components/app/CategoryList";
import UserPanel from "../../components/app/UserPanel";
import SideTabs from "../../components/app/SideTabs";
import MobileNav from "../../components/app/MobileNav";
import MobileNoteEditor from "../../components/app/MobileNoteEditor";
import MobileMenu from "../../components/app/MobileMenu";
import moment from "moment";
import pako from "pako";
import { debounce } from "lodash-es";
import "font-awesome/css/font-awesome.min.css";

const noteSorter = (a, b) => {
  const diff = a.id - b.id;
  if (diff > 0) {
    return -1;
  } else if (diff < 0) {
    return 1;
  }
  return 0;
};

export default {
  name: "App",
  components: {
    NoteList,
    NoteEditor,
    MobileNav,
    MobileNoteEditor,
    MobileMenu,
    CategoryList,
    UserPanel,
    SideTabs,
  },
  data() {
    return {
      // aside
      currentTab: "category",
      // list
      listId: 1,
      fetching: false,
      // note
      notes: [],
      noteMap: {},
      currentNoteId: 0,
      pageMap: {},
      pageSize: 20,
      editorCollapsed: false,
      // category
      categories: [],
      categoryMap: {},
      categoriesMap: {},
      currentCategory: null,
      // user
      user: {},
      // sync
      lastSyncTime: null,
      // mobile
      isMobile: window.os.isMobile,
      showMobileMenu: false,
    };
  },
  computed: {
    displayNotes() {
      if (this.currentCategory && this.currentCategory !== "all") {
        return this.categoryMap[this.currentCategory] || [];
      }
      return this.notes;
    },
    isCategory() {
      return this.currentCategory ? true : false;
    },
    mobileNavTitle() {
      let category = this.currentCategory || "all";
      if (category === "all") {
        category = "所有便签";
      } else if (category === "notalloc") {
        category = "未分类";
      }
      return this.fetching ? "数据获取中" : category;
    },
  },
  async created() {
    // 监听事件
    this.listenEvents("on");
    window.addEventListener("resize", debounce(this.handleWindowResized, 100));
    // 拉取数据
    const checkRet = await this.checkAuth();
    if (!checkRet) {
      return;
    }
    this.fetching = true;
    await this.fetchList();
    const fetchCategoryRet = await this.fetchCategories();
    if (!fetchCategoryRet) {
      this.$message.error("获取分类列表失败");
    }
    this.fetchUserInfo();
    this.fetching = false;
    // 设置最后一次同步的时间
    this.lastSyncTime = moment().format("YYYY-MM-DD HH:mm:ss");
    // 设置timer
    if (!window.fastnote) {
      window.fastnote = {};
    }
    this.startSyncTimer();
  },
  beforeDestroy() {
    this.listenEvents("off");
    this.removeSyncTimer();
  },
  methods: {
    listenEvents(op) {
      this.$bus[`\$${op}`]("change-category", this.changeCategory);
      this.$bus[`\$${op}`]("add-category", this.addCategory);
      this.$bus[`\$${op}`]("editor-collapse", this.editorCollapse);
      this.$bus[`\$${op}`]("editor-expand", this.editorExpand);
      this.$bus[`\$${op}`]("add-note", this.addNote);
      this.$bus[`\$${op}`]("copy-note", this.copyNote);
      this.$bus[`\$${op}`]("delete-note", this.deleteNote);
      this.$bus[`\$${op}`]("change-tab", this.changeTab);
      this.$bus[`\$${op}`]("open-mobile-menu", this.handleOpenMobileMenu);
      this.$bus[`\$${op}`]("close-mobile-menu", this.handleMobileMenuClose);
    },
    // 定时任务
    startSyncTimer() {
      this.doSync();
      if (!window.fastnote) {
        window.fastnote = {};
      }
      if (!window.fastnote.syncTime) {
        window.fastnote.syncTimer = setInterval(() => {
          this.doSync();
        }, 5000);
      }
    },
    removeSyncTimer() {
      if (window.fastnote?.syncTimer) {
        clearInterval(window.fastnote.syncTimer);
      }
    },
    // 数据
    async checkAuth() {
      if (!this.$auth.authToken) {
        const res = await this.$refreshToken();
        if (!res) {
          this.$router.replace("/portal");
          return false;
        }
      }
      return true;
    },
    fetchList(state) {
      return new Promise(async (resolve) => {
        let ret;
        try {
          if (!this.currentCategory) {
            ret = await this.axios.get(`${this.API_BASE}/note/list`, {
              params: {
                page: this.pageMap.all || 1,
                pageSize: this.pageSize,
              },
              headers: {
                Authorization: `Bearer ${this.$auth.authToken}`,
              },
            });
          } else {
            ret = await this.axios.get(`${this.API_BASE}/note/listByCat`, {
              params: {
                page: this.pageMap[this.currentCategory] || 1,
                pageSize: this.pageSize,
                category: this.currentCategory,
              },
              headers: {
                Authorization: `Bearer ${this.$auth.authToken}`,
              },
            });
          }
        } catch (err) {
          console.error("Fetch note list error: ", err);
          this.$message.error("获取便签列表失败");
          return resolve(false);
        }
        if (!ret || !ret.data || !ret.data.success) {
          this.$message.error("获取便签列表失败");
          return resolve(false);
        }
        const { data } = ret.data;
        this.processNotes(data);
        if (data.length) {
          if (!this.pageMap[this.currentCategory || "all"]) {
            this.pageMap[this.currentCategory || "all"] = 2;
          } else {
            this.pageMap[this.currentCategory || "all"] += 1;
          }
        }
        if ((!data || !data.length) && state) {
          state.complete();
          return resolve(true);
        }
        if (state) state.loaded();
        resolve(true);
      });
    },
    fetchCategories() {
      return new Promise(async (resolve) => {
        let ret;
        try {
          ret = await this.axios.get(`${this.API_BASE}/category/get`, {
            headers: {
              Authorization: `Bearer ${this.$auth.authToken}`,
            },
          });
        } catch (err) {
          console.error("Fetch categoires error: ", err);
          return resolve(false);
        }
        if (!ret || !ret.data) {
          return resolve(false);
        }
        const { success, data } = ret.data;
        if (!success) {
          return resolve(false);
        }
        this.processCategories(data.content);
        this.sortCategories();
        resolve(true);
      });
    },
    async fetchUserInfo() {
      try {
        const res = await this.axios.get(`${this.API_BASE}/user/getInfo`, {
          headers: {
            Authorization: `Bearer ${this.$auth.authToken}`,
          },
        });
        if (!res.data || !res.data.success) {
          this.$message.error("获取用户信息失败");
          return false;
        }
        const {
          data: { id: uid, username, email },
        } = res.data;
        this.user = {
          uid,
          username,
          email,
        };
        return true;
      } catch (err) {
        this.$message.error("获取用户信息失败");
        return false;
      }
    },
    processNotes(data) {
      data.forEach((item) => {
        const { noteId, syncId, content, category } = item;
        if (this.noteMap[syncId]) {
          return;
        }
        if (noteId >= this.currentNoteId) {
          this.currentNoteId = noteId + 1;
        }
        const note = JSON.parse(pako.ungzip(content, { to: "string" }));
        note.syncId = syncId;
        note.needSync = false;
        this.notes.push(note);
        this.noteMap[noteId] = note;
        this.noteMap[syncId] = note;
        const categoryName = category || "notalloc";
        if (!this.categoryMap[categoryName]) {
          this.$set(this.categoryMap, categoryName, []);
        }
        this.categoryMap[categoryName].push(note);
      });
      this.sortNotes();
      this.sortCategoryMap();
    },
    sortNotes() {
      this.notes.sort(noteSorter);
    },
    sortCategories() {
      this.categories.sort((a, b) => {
        if (a.name === "all") {
          return -1;
        }
        if (b.name === "all") {
          return 1;
        }
        if (a.name === "all" && b.name === "notalloc") {
          return -1;
        }
        if (a.name === "notalloc" && b.name === "all") {
          return 1;
        }
        if (a.name === "notalloc") {
          return -1;
        }
        if (b.name === "notalloc") {
          return 1;
        }
        return 0;
      });
    },
    sortCategoryMap(key) {
      // 排序
      if (!key) {
        Object.keys(this.categoryMap).forEach((key) => {
          this.sortCategoryMap(key);
        });
        return;
      }
      this.categoryMap[key].sort(noteSorter);
    },
    // 事件处理
    changeTab(tab) {
      this.currentTab = tab;
    },
    async addCategory(category) {
      if (this.categoriesMap[category]) {
        this.$message.error("该分类已存在");
        return;
      }
      const newCategory = {
        name: category,
        count: 0,
      };
      const categories = [...this.categories, newCategory];
      const res = await this.saveCategories(categories);
      if (!res) {
        this.$message.error("保存新分类失败");
        return;
      }
      this.categories.push(newCategory);
      this.categoriesMap[category] = newCategory;
      this.$bus.$emit("category-added");
    },
    async saveCategories(categories) {
      const cat = categories || this.categories;
      try {
        const res = await this.axios.post(
          `${this.API_BASE}/category/update`,
          {
            categories: pako.gzip(JSON.stringify(cat), { to: "string" }),
          },
          {
            headers: {
              Authorization: `Bearer ${this.$auth.authToken}`,
            },
          }
        );
        return res.data && res.data.success ? true : false;
      } catch (err) {
        console.error("Save categories error: ", err);
        return false;
      }
    },
    changeCategory(category) {
      if (category === this.currentCategory) {
        return;
      }
      if (category === "all") {
        this.currentCategory = null;
      } else {
        this.currentCategory = category;
      }
      if (this.notes.length !== this.categoriesMap.all.count) {
        this.listId = this.listId + 1;
      }
      // category first fetch
      if (
        !this.categoryMap[this.currentCategory] ||
        this.categoryMap[this.currentCategory].length < 1
      ) {
        this.fetchList();
      }
    },
    editorCollapse() {
      this.editorCollapsed = true;
    },
    editorExpand() {
      this.editorCollapsed = false;
    },
    async addNote(text) {
      text = text.trim();
      if (!text) {
        this.$message.error("请输入便签的内容");
      }
      const noteId = this.currentNoteId;
      let category = null;
      if (!this.currentCategory && this.currentCategory !== "notalloc") {
        category = this.currentCategory;
      }
      let note = {
        id: noteId,
        time: moment().format("YYYY年MM月DD日"),
        rawtime: moment().format("YYYYMMDDHHmmss"),
        text,
        offset: 0,
        forceTop: false,
        markdown: false,
        category,
      };
      const saveRes = await this.saveNote(note);
      if (!saveRes) {
        this.$message.error("保存便签失败");
        return;
      }
      note = {
        ...note,
        syncId: saveRes.syncId,
      };
      // save是异步操作，noteId在这个时候可能会有变化，这个noteId有可能会被diff拉下来的新数据覆盖，产生冲突
      // 这里做一个防冲突处理
      if (noteId !== this.currentNoteId) {
        note.id = this.currentNoteId;
        note.needSync = true;
      }
      this.currentNoteId += 1;
      // 加入到数组
      this.notes.unshift(note);
      this.noteMap[note.id] = note;
      this.noteMap[saveRes.syncId] = note;
      const { category: noteCat } = note;
      if (noteCat) {
        if (!this.categoryMap[noteCat]) {
          this.$set(this.categoryMap, noteCat, []);
        }
        this.categoryMap[noteCat].unshift(note);
        this.categoriesMap.all.count += 1;
        this.categoriesMap[noteCat].count += 1;
      }
      await this.saveCategories();
      this.lastSyncTime = moment().format("YYYY-MM-DD HH:mm:ss");
      this.$bus.$emit("note-added", noteId);
      // anim
      this.$nextTick(() => {
        const wrapperEl = document.getElementById(`note-wrapper-${noteId}`);
        if (wrapperEl) {
          wrapperEl.setAttribute(
            "class",
            `${wrapperEl.getAttribute("class")} animated fadeInRight faster`
          );
        }
      });
    },
    async removeNote(noteId, callback) {
      const note = this.noteMap[noteId];
      const { category, syncId } = note;
      const categoryName = category || "notalloc";
      // 从分类Map移出
      const categoryMapIdx = this.categoryMap[categoryName].findIndex(
        (item) => item.syncId === syncId
      );
      this.categoryMap[categoryName].splice(categoryMapIdx, 1);
      // 修改计数
      this.categoriesMap[categoryName].count -= 1;
      this.categoriesMap.all.count -= 1;
      await this.saveCategories();
      // 移除动画
      const wrapper = document.getElementById(`note-wrapper-${noteId}`);
      if (wrapper) {
        wrapper.setAttribute(
          "class",
          "note-wrapper animated fadeOutLeft faster"
        );
      }
      // 延迟移除
      setTimeout(() => {
        const idx = this.notes.findIndex((item) => item.syncId === syncId);
        this.notes.splice(idx, 1);
      }, 500);
      this.noteMap[noteId] = null;
      this.noteMap[syncId] = null;
      if (typeof callback === "function") {
        callback();
      }
    },
    async saveNote(note) {
      try {
        const res = await this.axios.post(
          `${this.API_BASE}/note/save`,
          {
            noteId: note.id,
            category: note.category || null,
            content: pako.gzip(JSON.stringify(note), { to: "string" }),
          },
          {
            headers: {
              Authorization: `Bearer ${this.$auth.authToken}`,
            },
          }
        );
        if (!res.data || !res.data.success) {
          return false;
        }
        return res.data.data || null;
      } catch (err) {
        console.error("Save note error: ", err);
        return false;
      }
    },
    async copyNote(data) {
      const { noteId } = data;
      const note = this.noteMap[noteId];
      if (!note) {
        this.$message.error("复制失败，无法获取便签内容");
        return;
      }
      const { text } = note;
      await navigator.clipboard.writeText(text);
      this.$message.success("复制成功");
    },
    async deleteNote(data) {
      const { noteId } = data;
      const note = this.noteMap[noteId];
      if (!note) {
        this.$message.error("删除失败，无法获取便签同步ID");
        return;
      }
      const { syncId } = note;
      try {
        const res = await this.axios.post(
          `${this.API_BASE}/note/delete`,
          {
            syncId,
          },
          {
            headers: {
              Authorization: `Bearer ${this.$auth.authToken}`,
            },
          }
        );
        const { success } = res.data;
        if (!success) {
          this.$message.error(res.data.success);
          return;
        }
        this.lastSyncTime = moment().format("YYYY-MM-DD HH:mm:ss");
        this.removeNote(noteId, () => {
          this.$message.success("删除成功");
        });
      } catch (err) {
        this.$message.error("发生错误，删除失败");
        console.error("Delete note failed: ", err);
      }
    },
    async doSync() {
      let res;
      try {
        res = await this.axios.get(`${this.API_BASE}/sync/diff`, {
          params: {
            lastSync: this.lastSyncTime,
          },
          headers: {
            Authorization: `Bearer ${this.$auth.authToken}`,
          },
        });
      } catch (err) {
        console.error("Fetch diff data error: ", err);
        return;
      }
      if (!res || !res.data || !res.data.success) {
        return;
      }
      // 处理diff数据
      const {
        notes: updatedNotes,
        deleted: deletedNotes,
        categories,
      } = res.data.data;
      if (categories) {
        // 优先处理便签分类
        this.processCategories(categories);
      }
      if (
        updatedNotes &&
        Array.isArray(updatedNotes) &&
        updatedNotes.length > 0
      ) {
        this.processUpdated(updatedNotes);
      }
      if (
        deletedNotes &&
        Array.isArray(deletedNotes) &&
        deletedNotes.length > 0
      ) {
        this.processDeleted(deletedNotes);
      }
      // 处理需要重新同步回云端的数据
      const needUpdate = this.collectNeedUpdate();
      if (needUpdate && needUpdate.length > 0) {
        try {
          const updateRet = await this.axios.post(
            `${this.API_BASE}/sync/update`,
            {
              notes: needUpdate,
            },
            {
              headers: {
                Authorization: `Bearer ${this.$auth.authToken}`,
              },
            }
          );
          if (!updateRet.data.success) {
            console.error(
              "Update notes to remote failed: ",
              updatedRet.data.message || "unknown error"
            );
          }
        } catch (err) {
          console.error("Update notes to remote failed: ", err);
        }
      }
      // 更新最后同步时间
      this.lastSyncTime = moment().format("YYYY-MM-DD HH:mm:ss");
    },
    processCategories(data) {
      const categories = JSON.parse(pako.ungzip(data, { to: "string" }));
      categories.forEach((category) => {
        // 逐个检查存在
        const { name } = category;
        if (!this.categoriesMap[name]) {
          // 当前这个分类不存在
          this.categories.push(category);
          this.categoriesMap[name] = category;
          this.$set(this.categoryMap, name, []);
        } else {
          // 分类存在，直接覆盖相关信息
          this.categoriesMap[name].count = category.count;
        }
      });
      if (categories.length > 0) {
        // 存在有效数据才处理排序
        this.sortCategories();
      }
    },
    processUpdated(updated) {
      const categoriesNeedSort = [];
      updated.forEach((item) => {
        const { syncId } = item;
        // 解译
        const note = JSON.parse(pako.ungzip(item.content, { to: "string" }));
        const { category } = note;
        const categoryName = category || 'notalloc';
        // 设置状态和syncId
        note.needSync = false;
        note.syncId = syncId;
        // 便签可能是不存在的
        const stored = this.noteMap[syncId];
        if (stored) {
          // 便签之前有存在过，考虑到noteId和分类可能变更，先找到原内容，将其移除
          const idx = this.notes.findIndex((n) => n.syncId === syncId);
          if (idx >= 0) {
            this.notes.splice(idx, 1);
          }
          if (stored.category) {
            const catIdx = this.categoryMap[stored.category].findIndex(
              (n) => n.syncId === syncId
            );
            if (catIdx >= 0) {
              this.categoryMap[stored.category].splice(catIdx, 1);
            }
          }
          // 重新加入
          this.noteMap[syncId] = note;
          this.noteMap[note.id] = note;
          this.notes.push(note);
          if (!this.categoryMap[categoryName]) {
            this.$set(this.categoryMap, categoryName, []);
          }
          this.categoryMap[categoryName].unshift(note);
          categoriesNeedSort.push(categoryName);
        } else {
          // 便签不存在
          // 检查noteId冲突
          if (!this.noteMap[note.id]) {
            this.noteMap[note.id] = note;
            if (note.id > this.currentNoteId) {
              this.currentNoteId = note.id + 1;
            }
          } else {
            // noteId冲突，作为新便签加入
            note.id = this.currentNoteId;
            note.needSync = true;
            this.currentNoteId += 1;
          }
          this.noteMap[syncId] = note;
          this.noteMap[note.id] = note;
          this.notes.push(note);
          if (!this.categoryMap[categoryName]) {
            this.$set(this.categoryMap, categoryName, []);
          }
          this.categoryMap[categoryName].unshift(note);
        }
      });
      // 重新排序
      this.sortNotes();
      categoriesNeedSort.forEach((cat) => {
        this.sortCategoryMap(cat);
      });
    },
    processDeleted(deleted) {
      // 从有序数据里删除数据，删除不变更categories，无需排序
      deleted.forEach((item) => {
        const { syncId } = item;
        if (!this.noteMap[syncId]) {
          // 便签已经不存在，忽略
          return;
        }
        // 便签存在
        let note = this.noteMap[syncId];
        const idx = this.notes.findIndex((n) => n.syncId === syncId);
        // 处理category
        const { category } = note;
        const categoryName = category || 'notalloc';
        if (category) {
          const catIdx = this.categoryMap[categoryName].findIndex(
            (n) => n.syncId === syncId
          );
          this.categoryMap[categoryName].splice(catIdx, 1);
        }
        // 数组移除
        this.notes.splice(idx, 1);
        // map移除
        this.noteMap[note.id] = null;
        this.noteMap[syncId] = null;
        note = null;
      });
    },
    collectNeedUpdate() {
      // 收集所有需要push到云端的便签
      const items = [];
      this.notes.forEach((item) => {
        if (item.needSync) {
          items.push({
            noteId: item.id,
            category: item.category,
            syncId: item.syncId,
            content: pako.gzip(
              JSON.stringify(
                {
                  ...item,
                  needSync: false,
                },
                { to: "string" }
              )
            ),
          });
        }
      });
      return items;
    },
    handleWindowResized() {
      this.$bus.$emit("window-resized");
    },
    handleOpenMobileMenu() {
      this.showMobileMenu = true;
    },
    handleMobileMenuClose() {
      this.showMobileMenu = false;
    },
  },
};
</script>