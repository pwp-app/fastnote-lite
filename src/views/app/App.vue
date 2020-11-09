<template>
  <div class="app">
    <div class="app-aside">
      <div class="app-aside-content">
        <CategoryList
          v-if="currentTab === 'category'"
          :categories="categories"
          :currentCategory="currentCategory"
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
      <div class="app-main-bottom">
        <NoteEditor />
      </div>
    </div>
  </div>
</template>

<script>
import NoteList from "../../components/app/NoteList";
import NoteEditor from "../../components/app/NoteEditor";
import CategoryList from "../../components/app/CategoryList";
import SideTabs from "../../components/app/SideTabs";
import pako from "pako";
import "font-awesome/css/font-awesome.min.css";

export default {
  name: "App",
  components: {
    NoteList,
    NoteEditor,
    CategoryList,
    SideTabs,
  },
  data() {
    return {
      // aside
      currentTab: 'category',
      // note
      notes: [],
      noteMap: {},
      page: 1,
      pageSize: 20,
      // category
      categories: [],
      categoryMap: {},
      currentCategory: null,
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
    // 监听事件
    this.listenEvents();
  },
  methods: {
    // 功能
    listenEvents() {
      this.$bus.$on('change-category', this.changeCategory);
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
    processNotes(data) {
      const { notes, noteMap, categoryMap } = this;
      data.forEach((item) => {
        const { noteId, syncId, content, category } = item;
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
    changeCategory(category) {
      if (category === 'all') {
        this.currentCategory = null;
        return;
      }
      this.currentCategory = category;
    },
  },
};
</script>