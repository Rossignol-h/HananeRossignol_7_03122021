import Vue from "vue"
import App from "./App.vue"
import router from "./router" // vue-router instanceimport Vuetify from 'vuetify';
import "vuetify/dist/vuetify.min.css"
import vuetify from "./plugins/vuetify"
import store from "./store/store" // vuex store instance
import { sync } from "vuex-router-sync"

Vue.config.productionTip = false

const moment = require("moment") // format date
require("moment/locale/fr")
Vue.use(require("vue-moment"), {
  moment,
})
Vue.use(vuetify)
sync(store, router)

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app")

//unsync() // Unsyncs store from router
