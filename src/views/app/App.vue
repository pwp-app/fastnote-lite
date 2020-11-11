<template>
  <div class="app">
    <div class="app-aside">
      <div class="app-aside-content">
        <CategoryList
          v-show="currentTab === 'category'"
          :categories="categories"
          :currentCategory="currentCategory"
          />
        <UserPanel
          :user="user"
          v-show="currentTab === 'user'"
          />
      </div>
      <SideTabs
        :currentTab="currentTab"
        />
    </div>
    <div class="app-main">
      <div class="app-main-top">
        <NoteList
          :notes="displayNotes"
          :isCategory="isCategory"
          />
      </div>
      <div :class="{
        'app-main-bottom': true,
        'app-main-bottom__collapsed': editorCollapsed,
        }">
        <NoteEditor />
      </div>
    </div>
  </div>
</template>

<script>
import NoteList from "../../components/app/NoteList";
import NoteEditor from "../../components/app/NoteEditor";
import CategoryList from "../../components/app/CategoryList";
import UserPanel from '../../components/app/UserPanel';
import SideTabs from "../../components/app/SideTabs";
import moment from "moment";
import pako from "pako";
import "font-awesome/css/font-awesome.min.css";

export default {
  name: "App",
  components: {
    NoteList,
    NoteEditor,
    CategoryList,
    UserPanel,
    SideTabs,
  },
  data() {
    return {
      // aside
      currentTab: 'category',
      // note
      notes: [],
      noteMap: {},
      currentNoteId: 0,
      page: 1,
      pageSize: 20,
      editorCollapsed: false,
      // category
      categories: [],
      categoryMap: {},
      currentCategory: null,
      // user
      user: {},
    };
  },
  computed: {
    displayNotes() {
      const { notes, currentCategory, categoryMap } = this;
      if (currentCategory) {
        return categoryMap[currentCategory] || [];
      }
      return notes;
    },
    isCategory() {
      return this.currentCategory ? true : false;
    },
  },
  async created() {
    // 监听事件
    this.listenEvents('on');
    // 拉取数据
    const checkRet = await this.checkAuth();
    if (!checkRet) {
      return;
    }
    const fetchNoteRet = await this.fetchList();
    if (!fetchNoteRet) {
      this.$message.error("获取便签列表失败");
    }
    const fetchCategoryRet = await this.fetchCategories();
    if (!fetchCategoryRet) {
      this.$message.error("获取分类列表失败");
    }
    const fetchUserInfoRet = await this.fetchUserInfo();
    if (!fetchUserInfoRet) {
      this.$message.error("获取用户信息失败");
    }
  },
  beforeDestroy() {
    this.listenEvents('off');
  },
  methods: {
    // 功能
    listenEvents(op) {
      this.$bus[`\$${op}`]('change-category', this.changeCategory);
      this.$bus[`\$${op}`]('add-category', this.addCategory);
      this.$bus[`\$${op}`]('editor-collapse', this.editorCollapse);
      this.$bus[`\$${op}`]('editor-expand', this.editorExpand);
      this.$bus[`\$${op}`]('add-note', this.addNote);
      this.$bus[`\$${op}`]('change-tab', this.changeTab);
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
    fetchList() {
      const { page, pageSize, currentCategory } = this;
      return new Promise(async (resolve) => {
        let ret;
        try {
          if (!currentCategory) {
            ret = await this.axios.get(`${this.API_BASE}/note/list`, {
              params: {
                page,
                pageSize,
              },
              headers: {
                Authorization: `Bearer ${this.$auth.authToken}`,
              },
            });
          } else {
            ret = await this.axios.get(`${this.API_BASE}/note/listByCat`, {
              params: {
                page,
                pageSize,
                category: currentCategory,
              },
              headers: {
                Authorization: `Bearer ${this.$auth.authToken}`,
              },
            });
          }
        } catch (err) {
          console.error("Fetch note list error: ", err);
          return resolve(false);
        }
        if (!ret || !ret.data || !ret.data.success) {
          return resolve(false);
        }
        const { data } = ret.data;
        this.processNotes(data);
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
        this.categories = JSON.parse(pako.ungzip(data.content, { to: 'string' }));
        this.categories.sort((a, b) => {
          if (a.name === 'all') {
            return -1;
          }
          if (b.name === 'all') {
            return 1;
          }
          if (a.name === 'all' && b.name === 'notalloc') {
            return -1;
          }
          if (a.name === 'notalloc' && b.name === 'all') {
            return 1;
          }
          if (a.name === 'notalloc') {
            return -1;
          }
          if (b.name === 'notalloc') {
            return 1;
          }
          return 0;
        });
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
        this.uid = uid;
        this.username = username;
        this.email = email;
        return true;
      } catch (err) {
        this.$message.error("获取用户信息失败");
        return false;
      }
    },
    processNotes(data) {
      const { notes, noteMap, categoryMap } = this;
      data.forEach((item) => {
        const { noteId, syncId, content, category } = item;
        if (noteId >= this.currentNoteId) {
          this.currentNoteId = noteId + 1;
        }
        const note = JSON.parse(pako.ungzip(content, { to: "string" }));
        notes.push(note);
        noteMap[noteId] = note;
        noteMap[syncId] = note;
        const categoryName = category || 'notalloc';
        if (!categoryMap[categoryName]) {
          categoryMap[categoryName] = [];
        }
        categoryMap[categoryName].push(note);
      });
      // 排序
      Object.keys(categoryMap).forEach((key) => {
        categoryMap[key].sort((a, b) => {
          return b.id - a.id;
        });
      });
    },
    // 事件处理
    changeTab(tab) {
      this.currentTab = tab;
    },
    async addCategory(category) {
      const idx = this.categories.findIndex(item => item.name === category);
      if (idx >= 0) {
        this.$message.error('该分类已存在');
        return;
      }
      const newCategory = {
        name: category,
        count: 0,
      };
      const categories = [
        ...this.categories,
        newCategory,
      ];
      const res = await this.saveCategories(categories);
      if (!res) {
        this.$message.error('保存新分类失败');
        return;
      }
      this.categories.push(newCategory);
      this.$bus.$emit('category-added');
    },
    async saveCategories(categories) {
      const cat = categories || this.categories;
      try {
        const res = await this.axios.post(`${this.API_BASE}/category/update`, {
          categories: pako.gzip(JSON.stringify(cat), { to: 'string' }),
        }, {
          headers: {
            Authorization: `Bearer ${this.$auth.authToken}`,
          },
        });
        return res.data && res.data.success ? true : false;
      } catch (err) {
        console.error('Save categories error: ', err);
        return false;
      }
    },
    changeCategory(category) {
      if (category === 'all') {
        this.currentCategory = null;
        return;
      }
      this.currentCategory = category;
    },
    editorCollapse() {
      this.editorCollapsed = true;
    },
    editorExpand() {
      this.editorCollapsed = false;
    },
    async addNote(text) {
      const { currentCategory } = this;
      let note = {
        id: this.currentNoteId,
        time: moment().format('YYYY年MM月DD日'),
        rawtime: moment().format('YYYYMMDDHHmmss'),
        text,
        offset: 0,
        forceTop: false,
        markdown: false,
        category: !currentCategory || currentCategory === 'notalloc' ? null : currentCategory,
      };
      const saveRes = await this.saveNote(note);
      if (!saveRes) {
        this.$message.error('保存便签失败');
        return;
      }
      note = {
        ...note,
        isNew: true,
      };
      this.notes.unshift(note);
      this.noteMap[note.id] = note;
      const { category: noteCat } = note;
      if (noteCat && noteCat !== 'notalloc') {
        if (!this.categoryMap[noteCat]) {
          this.categoryMap[noteCat] = [];
        }
        this.categoryMap[noteCat].unshift(note);
        const idx = this.categories.findIndex(item => item.name === note.category);
        const idx_all = this.categories.findIndex(item => item.name === 'all');
        this.categories[idx].count += 1;
        this.categories[idx_all].count += 1;
        await this.saveCategories();
      } else {
        this.categoryMap['notalloc'].unshift(note);
        const idx_all = this.categories.findIndex(item => item.name === 'all');
        const idx_notalloc = this.categories.findIndex(item => item.name === 'notalloc');
        this.categories[idx_all].count += 1;
        this.categories[idx_notalloc].count += 1;
        await this.saveCategories();
      }
      this.$bus.$emit('note-added', this.currentNoteId);
      this.currentNoteId += 1;
    },
    async saveNote(note) {
      try {
        const res = await this.axios.post(`${this.API_BASE}/note/save`, {
          noteId: note.id,
          category: note.category || null,
          content: pako.gzip(JSON.stringify(note), { to: 'string' }),
        }, {
          headers: {
            Authorization: `Bearer ${this.$auth.authToken}`,
          }
        });
        if (!res.data || !res.data.success) {
          return false;
        }
        return true;
      } catch (err) {
        console.error('Save note error: ', err);
        return false;
      }
    },
  },
};
</script>