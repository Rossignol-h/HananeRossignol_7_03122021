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
  <v-container fluid class="signup-container">
    <v-row justify="center">
      <v-col lg="4" md="5" sm="7">
        <v-card color="text2" elevation="3" xs6>
          <v-card-title class="flat dense dark">
            <h1 class="font-weight-regular titre">Inscription</h1></v-card-title
          >
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

          <v-card-actions>
            <v-btn
              block
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

<!--------------------------------- CSS ----------------->
<style scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90vh;
}
</style>
