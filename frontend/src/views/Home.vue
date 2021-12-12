<script>
export default {
  name: "Home",

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
<!------------------------------------ HTML --------------->
    <!------------------------------------ CARD SECTION --------->
    <v-container width="80%" class="my-5">
      <v-layout row wrap>
        <!------------------------------ signup card ------------>
        <v-flex xs12 sm12 md6 lg6>
          <v-col>
            <v-hover>
              <template v-slot:default="{ hover }">
                <v-card
                  :elevation="hover ? 24 : 6"
                  @click="signupURL()"
                  height="400px"
                  min-width="290"
                  max-width="300"
                >
                  <v-img
                    contain
                    class="pa-2"
                    height="80%"
                    src="../assets/home-signup.svg"
                  >
                  </v-img>

                  <v-card-title
                    class="text-subtitle-1 py-2 d-flex justify-center"
                  >
                    <h2>Inscription</h2>
                  </v-card-title>
                </v-card>
              </template>
            </v-hover>
          </v-col>
        </v-flex>
        <!---------------------------------- login card --------->
        <v-flex xs12 sm12 md6 lg6>
          <v-col>
            <v-hover>
              <template v-slot:default="{ hover }">
                <v-card
                  :elevation="hover ? 24 : 6"
                  @click="loginURL()"
                  height="400px"
                  min-width="290"
                  max-width="300"
                >
                  <v-img
                    contain
                    class="pa-2"
                    height="80%"
                    src="../assets/home-login.svg"
                  >
                  </v-img>

                  <v-card-title
                    class="text-subtitle-1 py-2 d-flex justify-center"
                  >
                    <h2>Connexion</h2>
                  </v-card-title>
                </v-card>
              </template>
            </v-hover>
          </v-col>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<style scoped>
h2 {
  color: #d1515a;
}
.layout {
  justify-items: center;
}
</style>
