import Vue from "vue"
import Vuetify from "vuetify"
import vuetify from "./plugins/vuetify"
import App from "./App.vue"
import VueRouter from "vue-router"
import Routes from "./routes"
import store from "./store/store" // vuex store instance
import { sync } from "vuex-router-sync"
import axios from "axios"

axios.defaults.baseURL = "http://localhost:3000/api/"

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(Vuetify)
const unsync = sync(store, router)

const router = new VueRouter({
  routes: Routes,
  mode: "history",
})

new Vue({
  vuetify,
  render: (h) => h(App),
  router,
  store,
}).$mount("#app")

unsync() // Unsyncs store from router
