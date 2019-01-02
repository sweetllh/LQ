<template>
  <div>
    <v-header></v-header>
    <router-view></router-view>
  </div>

</template>


<script>
export default {
  components: {
  	
  },
  data() {
    return {
      userInfo: "",
    };
  },
  watch: {
  	
  },
  created() {
    // console.log(this.$route);
    this.userInfo = JSON.parse(sessionStorage.getItem("LQUserInfo")) || false;
    
  },
  methods: {
    
  },
};
</script>

<style scoped>

</style>

