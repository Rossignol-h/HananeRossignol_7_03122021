<script>
import Sidebar from "./Sidebar.vue"

export default {
  name: "Profile",

  components: {
    Sidebar,
  },
  data() {
    return {
      dialog: false,
      isValid: true,
      newUsername: "",
      file: "",
    }
  },
  computed: {
    user() {
      return this.$store.getters.user
    },
  },

  methods: {
    homeURL() {
      this.$router.push("/")
    },
    uploadImage() {
      const file = this.$refs.file.files[0]
      this.file = file
      console.log(this.file)
    },
    onSubmit() {
      const formData = new FormData()
      formData.append("username", this.newUsername)
      if (this.file !== null) {
        formData.append("image", this.file)
      }
      this.$store.dispatch("getUsers")
      this.$store.dispatch("getUserById", this.user.id)
      this.$store.dispatch("updateUser", formData)
      this.$store.dispatch("getUserById", this.user.id)
      //this.$router.go()
    },
    deleteUser(id) {
      this.$store.dispatch("deleteUser", id)
      this.$store.dispatch("logOut")
      setTimeout(() => {
        this.homeURL()
      }, 1000)
    },
  },
}
</script>

<!--------------------------------- HTML ----------------->

<template>
  <div>
    <Sidebar />
    <v-container class="flex-container">
      <!---------------------------------- Bloc profile ------->

      <v-col class="col-md-4">
        <v-card color="grey lighten-3" class="card profile-card" height="400px">
          <div class="background-block">
            <img
              src="https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
              alt="profile-sample1"
              class="background"
            />
          </div>
          <!----------------- User avatar display --------------->
          <div class="profile-thumb-block">
            <img
              :src="user.avatar"
              alt="photo de l'utilisateur"
              class="profile"
            />
          </div>

          <!----------------- User username display --------------->

          <section class="card-content">
            <h2>{{ user.username }}</h2>
            <div>
              <!------------ Btn delete user -------------->

              <v-dialog
                v-model="dialog"
                transition="dialog-top-transition"
                max-width="600"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="white"
                    id="delete"
                    class="mx-2"
                    fab
                    small
                    outlined
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon color="red darken-3" size="22">
                      mdi-close-outline
                    </v-icon>
                  </v-btn>
                </template>
                <!------------- Popup for confirm delete user ---------->

                <v-card>
                  <v-toolbar class="text-h6" color="grey lighten-1" dark
                    >Confirmation</v-toolbar
                  >
                  <v-card-text class="text-h6 pa-11 justify-center">
                    Suppression de votre compte ?
                  </v-card-text>
                  <!------------- Popup cancel btn ---------->
                  <v-card-actions class="justify-center">
                    <v-btn
                      color="blue-grey"
                      class="ma-2 white--text"
                      @click="dialog = false"
                    >
                      Annuler
                      <v-icon right dark> mdi-login-variant </v-icon>
                    </v-btn>
                    <!------------- Popup Confirm btn ---------->
                    <v-btn
                      color="blue-grey"
                      class="ma-2 white--text"
                      @click="deleteUser(user.id)"
                    >
                      Confirmer
                      <v-icon right dark>
                        mdi-checkbox-marked-circle-outline
                      </v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
            <!------------ Update username-------------->

            <form enctype="multipart/form-data" method="put">
              <div>
                <v-text-field
                  label="Nouveau pseudo"
                  v-model="newUsername"
                  counter="10"
                  prepend-icon="mdi-account-edit"
                  hint="entre 3 et 10 caractères"
                  class="mx"
                ></v-text-field>
              </div>
              <!------------------------ upload avatar ------->
              <div>
                <v-file-input
                  @change="uploadImage"
                  v-model="file"
                  ref="file"
                  label="Nouvel avatar"
                  type="file"
                  name="avatar"
                  accept="image/png, image/jpeg, image/jpg
                        image/bmp, image/webp, image/gif"
                  hide-details
                  prepend-icon="mdi-camera dark"
                ></v-file-input>
              </div>
              <!------------ btn submit form -------------->
              <div>
                <v-btn
                  class="white--text mt-4 light-blue darken-4"
                  block
                  @click.prevent="onSubmit(user.id)"
                  :disabled="!isValid"
                  >Envoyer
                </v-btn>
              </div>
            </form>
          </section>
        </v-card>
      </v-col>
    </v-container>
  </div>
</template>

<!------------------------------------- CSS ------------------------>
<style scoped>
.profile-card {
  position: relative;
  float: left;
  width: 100%;
  text-align: center;
  background-color: rgb(201, 243, 16);
  height: 420px;
  border-radius: 0.6rem;
}
.profile-card .background-block {
  background: #eceaea;
  float: left;
  width: 100%;
  height: 200px;
  overflow: hidden;
}
.profile-card .background-block .background {
  clip-path: polygon(50% 0%, 100% 0, 100% 53%, 0 83%, 0 0);
  width: 100%;
  vertical-align: top;
  opacity: 0.9;
  -webkit-filter: blur(0.5px);
  filter: blur(0.5px);
  -webkit-transform: scale(1.8);
  transform: scale(2.8);
}
.profile-card .card-content {
  width: 100%;
  padding: 15px 25px;
  float: left;
  background: #eceaea;
  height: 60%;
  border-radius: 0 0 5px 5px;
  position: relative;
  z-index: 50;
}
.profile-card .profile {
  border-radius: 50%;
  background-color: #1d2d2c;
  position: absolute;
  bottom: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  opacity: 1;
  border: 2px solid rgba(255, 255, 255, 1);
  -webkit-transform: translate(-50%, 0%);
  transform: translate(-50%, 0%);
  z-index: 50;
}
#delete {
  position: absolute;
  left: 80%;
  bottom: 80%;
}
.profile-card .profile img {
  object-fit: cover;
}
.profile-card h2 {
  text-transform: capitalize;
  letter-spacing: 0.06rem;
  margin: 0 0 5px;
  font-weight: 5 00;
  font-size: 25px;
}
.submit {
  color: aliceblue;
}
</style>
