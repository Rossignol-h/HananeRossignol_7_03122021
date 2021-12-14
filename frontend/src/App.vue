<template>
  <v-app>
    <v-main>
      <router-view></router-view>
      <!-- Display view pages here based on route -->
    </v-main>
  </v-app>
</template>

<script>
import "../public/style.css"

export default {
  name: "app",
}
</script>

<style>
.v-main {
  background-color: #091f43;
}
</style>
