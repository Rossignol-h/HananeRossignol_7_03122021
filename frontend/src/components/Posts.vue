<script>
export default {
  name: "Posts",
  components: {},
  props: {
    post: {
      type: Object,
    },
  },
  data: function () {
    return {
      testlikes: 0,
      show: false,
      width: 500,
      commentForm: false,
      user: false,
      showFeed: true,
      update: false,
      isValid: true,
      rules: {
        required: (value) => !!value || "Required.",
      },

      data: {
        commentMessage: "",
        commentusername: this.$store.state.user.username,
      },
    }
  },
  computed: {
    isLiked() {
      const userId = this.$store.state.user.id
      let userLike = this.post.Likes.map((a) => a.UserId)
      if (userLike.includes(userId)) {
        return "pink"
      } else {
        return ""
      }
    },
  },

  methods: {
    reloadPage() {
      window.location.reload()
    },

    deletePost() {
      this.$emit("deletePost", this.post.id)
      window.location.reload()
    },
    likePost() {
      this.$emit("likePost", this.post.id)
    },
    getOnePost(id) {
      this.$router.push(`posts/${id}`)
    },
    onSubmitComment(id) {
      this.$store.dispatch("getPosts")
      this.$store.dispatch("commentPost", {
        id: id,
        data: this.data,
      })
      this.data.commentMessage = ""
      this.$store.dispatch("getPosts")
      this.$store.dispatch("getPostById", this.post.id)
    },

    deleteComment(id) {
      this.$store.dispatch("deleteComment", id)
      location.reload()
    },
  },
}
</script>

<!-------------------------------------------- HTML ----------->

<template>
  <div>
    <v-card class="mx-auto mt-4 mb-4 pb-5" round>
      <div>
        <div class="d-flex justify-space-between pr-2">
          <v-card-title class="post-title">
            <!----------------- avatar display -------------->
            <v-avatar class="profil-post" size="52px">
              <img
                v-if="post.User.avatar"
                :src="post.User.avatar"
                alt="Photo de profil"
              />
              <v-icon
                role="avatar personnalisé"
                v-else-if="
                  post.User.avatar === null &&
                  post.User.id === $store.state.user.id
                "
                color="grey darken-2"
                size="52px"
                >mdi-account</v-icon
              >
              <v-icon role="avatar" size="52px" v-else>mdi-account</v-icon>
            </v-avatar>
            <!----------------- Username & Date display -------------->

            <div class="mt-3">
              <span class="username text-left ml-5">{{
                post.User.username
              }}</span>
              <span
                class="text-body-1 font-italic font-weight-thin ml-5 text-left"
                >{{ post.createdAt | moment("calendar") }}</span
              >
            </div>
            <v-divider></v-divider>
          </v-card-title>
          <!----------------- Btn Edit post display -------------->
          <div class="ma-3">
            <v-tooltip v-if="$store.state.user.id == post.User.id" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="mx-2"
                  fab
                  primary
                  x-small
                  v-bind="attrs"
                  v-on="on"
                  aria-label="modifier le post"
                  @click="getOnePost(post.id)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>Modifier</span>
            </v-tooltip>
            <!----------------- Btn Delete post display -------------->

            <v-tooltip
              v-if="
                $store.state.user.id === post.User.id ||
                $store.state.user.isAdmin === true
              "
              bottom
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="mx-2"
                  fab
                  primary
                  x-small
                  v-bind="attrs"
                  v-on="on"
                  aria-label="supprimer le post"
                  @click="deletePost(post.id)"
                >
                  <v-icon dense> mdi-delete-forever </v-icon>
                </v-btn>
              </template>
              <span>Supprimer</span>
            </v-tooltip>
          </div>
        </div>
        <v-divider></v-divider>
        <!----------------------------- Post message display ---------->

        <div>
          <v-card-text class="text-left">
            <p class="body-1">
              {{ post.message }}
            </p>
          </v-card-text>
        </div>
        <v-divider></v-divider>
        <!----------------------------- GIF or Image display ---------->

        <div class="pa-5">
          <v-img
            v-if="post.link"
            :src="post.link"
            alt="image animé"
            :max-height="300"
            :max-width="400"
            class="mx-auto pb-5"
          >
          </v-img>
          <v-img
            v-if="post.imageUrl"
            :src="post.imageUrl"
            alt="image de la publication"
            :max-height="600"
            :max-width="400"
            class="mx-auto pb-5"
          >
          </v-img>
        </div>
        <v-divider></v-divider>

        <!----------------------- Add comment ----------------->
        <v-card-actions class="pt-5 pr-4 d-flex justify-space-between">
          <div class="d-flex justify-md-space-between">
            <v-badge
              bordered
              color="blue darken-3"
              :content="post.Comments.length"
              :value="post.Comments.length"
              overlap
            >
              <v-icon large> mdi-comment-account-outline </v-icon>
            </v-badge>

            <v-btn
              @click="show = !show"
              text
              aria-label="Bouton pour commenter"
              class="white--text"
              color="red darken-2"
              depressed
            >
              Commentaires
            </v-btn>

            <v-btn icon @click="show = !show" aria-label="accès commentaires">
              <v-icon>{{
                show ? "mdi-chevron-up" : "mdi-chevron-down"
              }}</v-icon>
            </v-btn>
          </div>
          <!----------------- btn for like ------------------->
          <div class="d-flex align-end pr-3">
            <v-btn
              @click="likePost(post.id)"
              x-small
              aria-label="liker"
              class="like-btn mx-1"
            >
              Je like !
            </v-btn>

            <div>
              <v-badge
                :content="post.Likes.length"
                :value="post.Likes.length"
                color="blue darken-2"
                overlap
              >
                <v-icon large color="red"> mdi-heart </v-icon>
              </v-badge>
            </div>
          </div>

          <!--------------------------------------->
        </v-card-actions>
        <v-expand-transition>
          <div v-show="show">
            <v-divider></v-divider>
            <div class="comments-box d-flex flex-column justify-center">
              <v-card-text class="comment-input">
                <v-form
                  v-model="isValid"
                  @submit.prevent="onSubmitComment(post.id)"
                  enctype="multipart/form-data"
                >
                  <v-text-field
                    name="input-1-3"
                    label="ton commentaire"
                    v-model="data.commentMessage"
                    auto-grow
                  >
                  </v-text-field>
                  <!--------------- btn submit comment ------>
                  <v-btn
                    @click="onSubmitComment(post.id)"
                    :disabled="!isValid"
                    aria-label="publier commentaire"
                    >Poster</v-btn
                  >

                  <!------------------------ Comments list ---------->
                </v-form>
                <div></div>
              </v-card-text>
              <v-list
                v-for="comment in post.Comments"
                :key="comment.id"
                :comment="comment"
              >
                <v-list-item class="comment">
                  <!------------------------ Avatar users display ---------->

                  <v-list-item-avatar class="comment_photo">
                    <img
                      v-if="comment.User.avatar !== null"
                      :src="comment.User.avatar"
                      alt="Photo de profil"
                    />
                    <!------------- if avatar null add this icon ---------->

                    <v-icon
                      v-else-if="
                        comment.User.avatar === null &&
                        comment.UserId === $store.state.user.id
                      "
                      color="grey darken-2"
                      size="32px"
                      role="avatar"
                      >mdi-account-circle</v-icon
                    >
                    <v-icon v-else size="32px" role="avatar"
                      >mdi-account-circle</v-icon
                    >
                  </v-list-item-avatar>
                  <!------------------------ Username display ---------->

                  <v-list-item-content class="comment_body d-flex">
                    <strong
                      v-html="comment.User.username"
                      class="pr-5 text-left username comment__username"
                    ></strong>
                    <!-------------------- Comment text display ---------->

                    <span
                      v-html="comment.message"
                      class="text-left comment__message"
                    ></span>
                  </v-list-item-content>
                  <!------------------------ if owner of comment 
                  Or Admin = show this btn -------------------------->

                  <!----------------------- Btn delete Comment --------->
                  <v-btn
                    v-if="
                      $store.state.user.id === comment.UserId ||
                      $store.state.user.isAdmin === true
                    "
                    @click="deleteComment(comment.id)"
                    fab
                    primary
                    small
                  >
                    <v-icon aria-label="supprimer commentaire" color="red"
                      >mdi-delete-forever
                    </v-icon>
                  </v-btn>

                  <!---------------------------------------- End ------->
                </v-list-item>
                <v-divider></v-divider>
              </v-list>
            </div>
          </div>
        </v-expand-transition>
      </div>
    </v-card>
  </div>
</template>
