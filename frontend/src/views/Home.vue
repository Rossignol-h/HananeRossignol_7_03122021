<script>
export default {
  methods: {
    loginURL() {
      this.$router.push("/login")
    },
    signupURL() {
      this.$router.push("/signUp")
    },
  },
}
</script>
<!--------------------------------------- HTML ---------------------->

<!---------------------------------- Signup card --------->

<template>
  <div class="hom--container">
    <v-row rows="2">
      <v-col class="d-flex child-flex">
        <v-card @click="signupURL()" class="mx-auto" max-width="400">
          <v-img
            class="white--text align-end"
            height="200px"
            src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
          >
            <v-card-title>Top 10 Australian beaches</v-card-title>
          </v-img>

          <v-card-actions>
            <v-btn color="orange" text> Inscription </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <!---------------------------------- Login card --------->
      <v-col>
        <v-card @click="loginURL()" class="mx-auto" max-width="400">
          <v-img
            class="white--text align-end"
            height="200px"
            src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
          >
            <v-card-title>Top 10 Australian beaches</v-card-title>
          </v-img>

          <v-card-actions>
            <v-btn color="orange" text> Connexion </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
