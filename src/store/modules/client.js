const state = {
  status: null,
  version: null,
};

const mutations = {
  setStatus(state, status) {
    state.status = status;
  },
  setVersion(state, version) {
    state.version = version;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
