<script>
import Sidebar from "../components/Sidebar.vue"
import Posts from "../components/Posts.vue"

export default {
  name: "Feed",
  components: {
    Posts,
    Sidebar,
  },
  computed: {
    posts() {
      return this.$store.getters.posts
    },
  },
  data() {
    return {
      fab: false,
    }
  },
  beforeMount() {
    this.$store.dispatch("getPosts")
  },

  methods: {
    onScroll(e) {
      if (typeof window === "undefined") return
      const top = window.pageYOffset || e.target.scrollTop || 0
      this.fab = top > 20
    },
    toTop() {
      this.$vuetify.goTo(0)
    },

    deletePost(id) {
      this.$store.dispatch("deletePost", id)
    },
    deleteComment(id) {
      this.$store.dispatch("deleteComment", id)
    },

    likePost(id) {
      const data = 1
      this.$store.dispatch("likePost", {
        id: id,
        data: data,
      })
      this.$store.dispatch("getPosts")
    },

    createPost(e) {
      if (typeof window === "undefined") return
      const top = window.pageYOffset || e.target.scrollTop || 0
      this.fab = top > 0
    },
    create() {
      this.$router.push("/add")
    },
  },
}
</script>

<!-------------------------------- HTML --------------->

<template>
  <v-container fluid class="feed-container scroll-y">
    <!---------- btn for scrolling to top -->
    <v-btn
      v-scroll="onScroll"
      v-show="fab"
      fab
      dark
      fixed
      bottom
      right
      color="primary"
      @click="toTop"
    >
      <v-icon>mdi-chevron-double-up</v-icon>
    </v-btn>

    <!---------- fixed floating btn link to create Post -v-show="fab"-->
    <v-btn
      v-scroll="createPost"
      dark
      fixed
      top
      right
      color="pink"
      @click="create"
      >Publier
      <v-icon>mdi-comment-text-outline</v-icon>
    </v-btn>
    <!------------------------- Start feed section ----------->

    <v-row class="" id="scroll-target">
      <Sidebar />
      <!-------------------------- Header logo ---->
      <v-col sm="12" md="6" class="mx-auto">
        <v-system-bar id="feed-header" height="150">
          <div class="feed-header">
            <v-img width="250" src="../assets/feed-logo.svg"> </v-img>

            <h1 class="text-h4 text-center">Réseau social</h1>
          </div>
        </v-system-bar>
      </v-col>
    </v-row>

    <!----------------------------- Start all posts ------>

    <v-row
      class="bloc2 text-center d-flex flex-column justify-center align-center"
    >
      <v-col sm="12" md="6" class="mx-auto">
        <!------------------ if posts EXIST display this ----->

        <v-card min-height="90vh" class="blue-grey mx-auto" elevation="2">
          <v-card-text class="blue-grey">
            <posts
              v-for="post of posts"
              :key="post.id"
              :post="post"
              :id="post.id"
              @deletePost="deletePost(post.id)"
              @likePost="likePost(post.id)"
              @reloadFeed="reloadFeed()"
              @onSubmitComment="onSubmitComment(post.id)"
              @deleteComment="deleteComment(comment.id)"
            >
            </posts>
          </v-card-text>
          <!--------------------- if posts  NULL display this ----->
          <v-card
            v-if="$store.state.posts.length === 0"
            class="mx-auto"
            max-width="500"
          >
            <v-card-title class="d-flex justify-center" flat dense dark>
              <span>Aucune publication !</span>
            </v-card-title>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<!---------------------------------- CSS ----------------->

<style scoped>
.feed-container {
  background: url(../assets/bg-icon.png);
  background-position: center;
  background-attachment: fixed;
}

#feed-header {
  background: rgba(40, 57, 101, 0.5);
}
h1 {
  color: aliceblue;
}
</style>
