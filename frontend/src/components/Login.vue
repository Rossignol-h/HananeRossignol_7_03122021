<script>
import Auth from "../services/Auth.js"
import MyHeader from "../components/Header.vue"

export default {
  name: "Login",

  components: {
    MyHeader,
  },

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
    signupURL() {
      this.$router.push("/")
    },

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
        console.log(error)
        setTimeout(() => {
          this.email = ""
          this.password = ""
        }, 500)
      }
    },
  },
}
</script>
<!--------------------------------------- HTML ---------------->

<template>
  <div>
    <MyHeader />

    <v-container fluid class="flex-container">
      <v-row justify="center">
        <v-col lg="4" md="5" sm="7">
          <v-card class="pa-6" xs6>
            <!----------------  link to signup page --------->
            <v-btn
              @click="signupURL()"
              :disabled="loading"
              class="text-caption text-decoration-underline text-lowercase"
              color="grey darken-2"
              plain
            >
              Pas encore de compte ?
            </v-btn>
            <!----------------  Bloc login --------->
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
            <!----------------  Submit form --------->
            <v-card-actions>
              <v-btn
                block
                depressed
                color="primary"
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
  </div>
</template>
