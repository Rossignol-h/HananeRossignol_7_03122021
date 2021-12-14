<script>
import Sidebar from "../components/Sidebar.vue"

export default {
  name: "NewPost",

  components: {
    Sidebar,
  },

  data() {
    return {
      isValid: true,
      options: true,
      message: "",
      link: null,
      file: "",
    }
  },
  computed: {},
  methods: {
    uploadImage() {
      const file = this.$refs.file.files[0]
      this.file = file
    },
    onSubmit() {
      const formData = new FormData()
      formData.append("message", this.message)
      if (this.link !== null) {
        formData.append("link", this.link)
      }
      if (this.file !== null) {
        formData.append("image", this.file)
      }
      this.$store.dispatch("createPost", formData)
      this.$router.push("/posts")
    },
  },
}
</script>

<!-------------------------------------- HTML ------------->

<template>
  <div>
    <Sidebar />
    <v-container fluid class="flex-container">
      <v-row justify="center">
        <v-col lg="4" md="5" sm="7">
          <v-card height="420px" xs6>
            <!----------------------------- Card H1 ------------------>
            <v-card-title>
              <h1 class="subtitle-1 red--text">NOUVELLE PUBLICATION</h1>
            </v-card-title>
            <v-divider></v-divider>
            <!--------------------------------- form -------->
            <v-form
              v-model="isValid"
              @submit.prevent="onSubmit"
              enctype="multipart/form-data"
            >
              <!------------------------input message ------------->
              <div class="py-5 px-5 mr-5">
                <v-textarea
                  name="message"
                  label="Message"
                  v-model="message"
                  auto-grow
                  required
                ></v-textarea>

                <!-------------------------- Add image -->

                <div class="d-flex">
                  <v-file-input
                    @change="uploadImage"
                    v-model="file"
                    accept="image/png, image/jpeg,image/jpg
                image/bmp, image/gif, image/webp"
                    color="deep-blue accent-4"
                    label="Ajouter une image"
                    hide-details
                    prepend-icon="mdi-camera dark"
                    outlined
                    dense
                  >
                  </v-file-input>
                </div>

                <!-----------------------Add Url gif ------------>

                <div class="d-flex justify-center mt-5">
                  <v-text-field
                    name="input-1-7"
                    label="Coller Url du gif"
                    v-model="link"
                    hide-details
                    dense
                    prepend-icon="mdi-file-video dark"
                    outlined
                  >
                  </v-text-field>
                </div>

                <!--------------------------- Btn submit ------------>
                <div class="d-flex justify-center mt-5">
                  <v-btn
                    class="white--text light-blue darken-4"
                    block
                    @click="onSubmit"
                    :disabled="!isValid"
                    depressed
                  >
                    Poster
                  </v-btn>
                </div>
              </div>
            </v-form>
            <!-------------------------------------- end of form-->
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
