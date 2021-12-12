<template>
  <v-container fluid class="login-container">
    <v-row justify="center" align="center">
      <v-col lg="4" md="5" sm="7">
        <v-card elevation="3" xs6>
          <v-card-title class="flat dense dark">
            <h1 class="font-weight-regular">Connexion</h1>
          </v-card-title>

          <v-card-text class="font-weight-light">
            <v-form v-model="isValid">
              <v-text-field
                label="email*"
                v-model="email"
                type="email"
                :counter="20"
                :rules="[(v) => !!v || 'Email obligatoire']"
                required
              >
              </v-text-field>
              <v-text-field
                label="mot de passe*"
                :append-icon="value ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="() => (value = !value)"
                :type="value ? 'password' : 'text'"
                v-model="password"
                :counter="20"
                hint="8 caractères, 1 Maj et 1 chiffres"
                :rules="[(v) => !!v || 'Mot de passe obligatoire']"
                required
              >
              </v-text-field>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-btn
              block
              elevation="2"
              :disabled="!isValid"
              v-on:click.prevent="login"
              >Envoyer
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Auth from "../services/Auth.js"
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      isValid: true,
      value: String,
      data: "",
    }
  },
  methods: {
    async login() {
      try {
        const response = await Auth.login({
          email: this.email,
          password: this.password,
        })
        this.data = response.data

        this.$store.dispatch("setToken", response.data.token)
        this.$store.dispatch("setUser", response.data.user)
        this.$store.dispatch("getUserById", response.data.user.id)
        let router = this.$router
        setTimeout(function () {
          router.push("/posts")
        }, 1500)
      } catch (error) {
        this.errorMessage = error.response.data.error
        setTimeout(() => {
          this.email = ""
          this.password = ""
        }, 500)
      }
    },
  },
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90vh;
}
</style>
