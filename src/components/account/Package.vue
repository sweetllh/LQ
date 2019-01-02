<template>
        <!-- 我的套餐 -->
        <div>
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
    this.userInfo = JSON.parse(sessionStorage.getItem("LQUserInfo")) || false;
  },
  methods: {
 
  },
  
};
</script>

<style scoped>
</style>

