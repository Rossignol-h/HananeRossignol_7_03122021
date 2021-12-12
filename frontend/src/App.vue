<template>
  <v-app>
    <MyHeader />
    <v-main>
      <router-view></router-view>
      <!-- Display view pages here based on route -->
    </v-main>
  </v-app>
</template>

<script>
import MyHeader from "./components/Header.vue"
import "../public/style.css"
export default {
  name: "app",
  components: {
    MyHeader,
  },
  data: () => {
    return {}
  },
  computed: {
    user() {
      return this.$store.getters.user
    },
  },
  mounted() {
    if (this.user.email) {
      this.$store.dispatch("getUsers")
      this.$store.dispatch("getUserById", this.user.id)
    }
  },
}
</script>

<style>
.v-main {
  background: rgb(209, 81, 90);
  background: linear-gradient(
    190deg,
    rgba(209, 81, 90, 1) 0%,
    rgba(235, 125, 133, 0.9920167896260067) 46%,
    rgba(216, 216, 216, 1) 92%
  );
}
</style>
