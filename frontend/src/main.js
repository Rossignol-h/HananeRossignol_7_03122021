import Vue from "vue"
import vuetify from "./plugins/vuetify"
import App from "./App.vue"
import VueRouter from "vue-router"
import Routes from "./routes"
import axios from "axios"

axios.defaults.baseURL = "http://localhost:3000/api/"

Vue.config.productionTip = false

Vue.use(VueRouter)

const router = new VueRouter({
  routes: Routes,
  mode: "history",
})

new Vue({
  vuetify,
  render: (h) => h(App),
  router: router,
}).$mount("#app")
