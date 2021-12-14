<script>
import Sidebar from "./Sidebar.vue"

export default {
  name: "OnePost",
  components: {
    Sidebar,
  },
  data() {
    return {
      e1: 1,
      isValid: true,
      message: "",
      link: null,
      file: "",
    }
  },
  computed: {
    post() {
      return this.$store.getters.post
    },
  },
  beforeMount() {
    let id = this.$route.params.id
    this.$store.dispatch("getPostById", id)
  },
  methods: {
    uploadImage() {
      const file = this.$refs.file.files[0]
      this.file = file
    },

    sendPost() {
      let id = this.$route.params.id
      const formData = new FormData()
      if (this.message !== null) {
        formData.append("message", this.message)
      }

      if (this.link !== null) {
        formData.append("link", this.link)
      }
      formData.append("image", this.file)
      this.$store.dispatch("getPosts")
      this.$store.dispatch("updatePost", formData)
      this.$store.dispatch("getPostById", id)
      this.$forceUpdate()
      alert("Post modifié !")
    },
    feedURL() {
      this.$router.push("/posts")
    },
  },
}
</script>

<!----------------------------------------------- HTML ---------------->

<template>
  <div>
    <Sidebar />
    <v-container class="flex-container">
      <!---------------------------------- Title of tabs ------------>
      <v-stepper non-linear>
        <v-stepper-header>
          <v-stepper-step color="red" editable step="1">
            Editer le message
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step color="red" editable step="2">
            Modifier l'image
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step color="red" editable step="3">
            Valider
          </v-stepper-step>
        </v-stepper-header>
        <!------------- Content of tabs -------------------------------->

        <v-stepper-items>
          <!-------------------------------- Step 1 Edit post message -->

          <v-stepper-content step="1">
            <v-card class="ma-10" height="200px">
              <v-textarea
                label="Votre nouveau message"
                v-model="message"
                :counter="400"
                type="text"
                solo
                required
                name="input-7-4"
              ></v-textarea>
            </v-card>
          </v-stepper-content>
          <!-------------------------------- Step 2 Change post image -->

          <v-stepper-content step="2">
            <v-card class="d-flex align-center" height="200px">
              <v-img
                height="180px"
                width="150px"
                v-if="post.imageUrl"
                :src="post.imageUrl"
              >
              </v-img>
              <v-file-input
                @change="uploadImage"
                v-model="file"
                ref="file"
                label="Nouvelle image"
                type="file"
                name="imageUrl"
                accept="image/png, image/jpeg, image/jpg
                        image/bmp, image/webp, image/gif"
                prepend-icon="mdi-camera dark"
              ></v-file-input>
            </v-card>
          </v-stepper-content>
          <!----------------------------------- Step 3 Submit new post -->

          <v-stepper-content step="3">
            <v-card height="200px" class="pa-10">
              <div class="d-flex justify-center flex-column">
                <h3 class="ml-5 font-weight-regular">
                  Vous confirmez cette modification ?
                </h3>
                <v-btn
                  class="white--text mt-8 light-blue darken-4"
                  depressed
                  @click.prevent="sendPost"
                  >Envoyer
                </v-btn>
                <v-btn
                  class="white--text mt-7 red"
                  depressed
                  @click.prevent="feedURL"
                  >Retour
                </v-btn>
              </div>
            </v-card>
          </v-stepper-content>
          <!-------------------------------------------------------->
        </v-stepper-items>
      </v-stepper>
    </v-container>
  </div>
</template>
