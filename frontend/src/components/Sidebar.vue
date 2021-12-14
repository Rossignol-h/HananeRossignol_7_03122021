<script>
export default {
  name: "Sidebar",
  data() {
    return {
      mini: true,
    }
  },
  methods: {
    getProfile(id) {
      this.$router.push(`/profile/${id}`)
    },
    feedURL() {
      this.$router.push("/posts")
    },
    logout() {
      this.$router.push("/login")
      sessionStorage.clear(), localStorage.clear()
    },
  },

  computed: {
    user() {
      return this.$store.getters.user
    },
  },
}
</script>
<!---------------------------------- HTML -------------->

<template>
  <div>
    <v-navigation-drawer
      id="Sidebar"
      :mini-variant.sync="mini"
      permanent
      absolute
    >
      <!------------------------------- Header: logo & username -->
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-img src="../assets/red-logo.svg"></v-img>
        </v-list-item-avatar>
        <v-list-item-title>{{ user.username }}</v-list-item-title>
        <!---------------------------------- Feed links -->

        <v-btn icon @click.stop="mini = !mini" aria-pressed="mixed">
          <v-icon>mdi-chevron-double-left</v-icon>
        </v-btn>
      </v-list-item>
      <v-divider></v-divider>
      <!-------------------------------------- Feed links -->
      <v-list>
        <v-list-item @click="feedURL()" dense>
          <v-list-item-icon>
            <v-icon>mdi-forum</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Publications</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!--------------------------------- Profile link-->
        <v-list-item @click="getProfile(user.id)" dense>
          <v-list-item-icon>
            <v-icon> mdi-account </v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Profil</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!--------------------------------- Logout link-->

        <v-list-item @click="logout()" dense>
          <v-list-item-icon>
            <v-icon>mdi-power</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Déconnexion</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>
<!---------------------------------- CSS -------------->

<style>
#Sidebar {
  background-color: rgba(216, 216, 216, 0.6);
}
#Sidebar i {
  color: #091f43;
  font-size: 1.7rem;
}
</style>
