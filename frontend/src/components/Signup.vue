<script>
import Auth from "../services/Auth.js"

export default {
  name: "Signup",
  data() {
    return {
      username: "",
      email: "",
      password: "",
      data: null,
      value: String,
      isValid: true,
      hasSignedUp: false,
      regexEmail: [
        (v) => !!v || "Email est obligatoire",
        (v) =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "L'email doit être valide",
      ],
    }
  },
  methods: {
    loginURL() {
      this.$router.push("/login")
    },
    async signup() {
      try {
        const response = await Auth.signup({
          username: this.username,
          email: this.email,
          password: this.password,
        })
        this.data = response.data
        this.$store.dispatch("setUser", response.data.user)
        this.$store.dispatch("getUserById", response.data.user.id)

        let router = this.$router
        setTimeout(function () {
          router.push("/login")
        }, 1500)
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>

<!--------------------------------- HTML ----------------->

<template>
  <v-container fluid class="flex-container">
    <v-row justify="center">
      <v-col lg="4" md="5" sm="7">
        <v-card class="pa-6" color="text2" elevation="3" xs6>
          <!----------------  link to login page --------->
          <v-btn
            @click="loginURL()"
            :disabled="loading"
            class="text-caption text-decoration-underline text-lowercase"
            color="grey darken-2"
            plain
          >
            Vous avez déjà un compte?
          </v-btn>
          <!----------------  Bloc signup --------->

          <v-card-title class="text-center dark">
            <h1 class="font-weight-regular">Inscription</h1>
          </v-card-title>
          <v-spacer></v-spacer>

          <v-card-text class="font-weight-light">
            <v-form v-model="isValid" autocomplete="off">
              <v-text-field
                label="pseudo*"
                v-model="username"
                type="text"
                :counter="10"
                :rules="[(v) => !!v || 'Le pseudo est obligatoire']"
                required
              ></v-text-field>
              <v-text-field
                label="email*"
                v-model="email"
                type="email"
                :counter="20"
                :rules="regexEmail"
                required
                autocomplete="off"
              ></v-text-field>
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
          <!----------------  Submit form --------->

          <v-card-actions>
            <v-btn
              type="submit"
              block
              depressed
              color="primary"
              elevation="2"
              :disabled="!isValid"
              v-on:click.prevent="signup"
              >Envoyer
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
