<script>
import MyHeader from "../components/Header.vue"
import Signup from "../components/Signup.vue"

export default {
  name: "Home",
  components: {
    MyHeader,
    Signup,
  },
}
</script>
<!------------------------------------ HTML --------------->
<template>
  <div>
    <MyHeader />
    <Signup />
  </div>
</template>
