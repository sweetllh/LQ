<template>
	<div>
		<div class="dialog-wrap">
			<div class="dialog-cover" v-show="isShow"></div>
			<transition name="drop">
				<div class="dialog-content" v-if="isShow">
					<!--<p class="dialog-close" @click="closeMyself">X</p>-->
					<img class="dialog-close" @click="closeMyself" src="../../assets/img/icon-close.png"/>
					<p class="title">{{title}}</p>
					<slot>empty</slot>
				</div>
			</transition>
			
		</div>
	</div>
</template>

<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    title: {
    	type: String,
    	default: '标题'
    }
  },
  data () {
    return {
      
    }
  },
  methods: {
    closeMyself () {
      this.$emit('on-close')
    }
  }
}
</script>

<style scoped>
.drop-enter-active {
  transition: all .3s ease;
}
.drop-leave-active {
  transition: all .15s ease;
}
.drop-enter {
  transform: translateY(-500px);
}
.drop-leave-active {
  transform: translateY(-500px);
}

.dialog-wrap {
 /* position: fixed;
  width: 100%;
  height: 100%;
  z-index: 20;*/
}
.dialog-cover {
  background: rgba(0,0 ,0 ,0.3);
  position: fixed;
  z-index: 5;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.dialog-content {
  width: 410px;
  position: fixed;
  min-height: 350;
  overflow: auto;
  background: #fff;
  top: 30%;
  left: 50%;
  margin-left: -225px;
 /* margin-top: -200px;*/
  z-index: 10;
  border: 1px solid #CCCCCC;
  padding: 25px 60px 38px;
  line-height: 1.6;
  box-sizing: border-box;
  border-radius: 10px;
}
.dialog-close {
  position: absolute;
  right: 5px;
  top: 5px;
  width: 40px;
  height: 40px;
  text-align: center;
  cursor: pointer;
  font-weight: 900;
}
.dialog-close:hover {
  color: #4fc08d;
}
.title{
	font-size:18px;
	font-family:MicrosoftYaHei;
	color:rgba(252,69,20,1);
	margin-bottom: 20px;
}
</style>