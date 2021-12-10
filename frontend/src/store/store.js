import Vue from "vue"
import Vuex from "vuex"
import createPersistedState from "vuex-persistedstate"
import Auth from "../services/auth.js"

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    token: null,
    user: {},
    isLoggedIn: true, //c 'était false a remettre apres test
    isLoading: false,

    users: [],

    message: "",
    error: "",
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
  getters: {
    users(state) {
      return state.users
    },
    user(state) {
      return state.user
    },
    messageRetour(state) {
      return state.message
    },
    errorMessage(state) {
      return state.error
    },
    isLogged(state) {
      return state.isLoggedIn
    },
  },

  mutations: {
    // users
    SET_TOKEN(state, token) {
      state.token = token
      if (token) {
        state.isLoggedIn = true
      } else {
        state.isLoggedIn = false
      }
    },
    DELETE_TOKEN(state) {
      state.token = null
      state.user = ""
      state.isLoggedIn = false
    },
    SET_USER(state, user) {
      state.user = user
    },
    GET_USER_BY_ID(state, user) {
      state.user = user
    },
    GET_USERS(state, users) {
      state.users = users
    },

    LOG_OUT(state) {
      sessionStorage.clear()
      state.token = null
      state.user = null
      state.isLoggedIn = false
      state.message = ""
      state.error = ""
    },
  },

  actions: {
    //users
    setToken({ commit }, token) {
      commit("SET_TOKEN", token)
    },
    deleteToken({ commit }, token) {
      commit("DELETE_TOKEN", token)
    },
    logOut({ commit }) {
      commit("LOG_OUT")
    },
    setUser({ commit }, user) {
      commit("SET_USER", user)
    },
    getUsers({ commit }) {
      Auth.getUsers().then((response) => {
        const users = response.data
        commit("GET_USERS", users)
      })
    },
    getUserById({ commit }) {
      let id = this.state.user.id
      Auth.getUserById(id).then((response) => {
        const user = response.data
        commit("GET_USER_BY_ID", user)
      })
    },
  },
})
