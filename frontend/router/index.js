import Vue from "vue"
import VueRouter from "vue-router"

import Home from "../views/Home.vue"
import Signup from "../components/Signup.vue"
import Login from "../components/Login.vue"
import Feed from "../views/Feed.vue"
import CreatePost from "../components/CreatePost.vue"
import Profile from "../components/Profile.vue"
import OnePost from "../components/OnePost.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/signup",
    name: "signup",
    component: Signup,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/profile/:id",
    name: "profile",
    component: Profile,
  },
  {
    path: "/posts",
    name: "feed",
    component: Feed,
  },
  {
    path: "/posts/:id",
    name: "OnePost",
    component: OnePost,
  },

  {
    path: "/add",
    name: "CreatePost",
    component: CreatePost,
  },
]
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
})

export default router
