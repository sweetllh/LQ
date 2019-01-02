<template>
  <div>
    <v-header></v-header>
    <!--<router-view></router-view>-->
    
    <!-- 这里是需要keepalive的 -->
		<keep-alive>
		    <router-view v-if="$route.meta.keepAlive"></router-view>
		</keep-alive>
		
		<!-- 这里不会被keepalive -->
		<router-view v-if="!$route.meta.keepAlive"></router-view>

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

