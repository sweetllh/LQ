<template>
	<div>
		<div class="dialog-wrap">
			<div class="dialog-cover" v-if="isShow"></div>
			<transition name="drop">
				<div class="dialog-content" v-if="isShow">
					<!--<p class="dialog-close" @click="closeMyself">X</p>-->
					<img class="dialog-close" @click="closeMyself" src="../../assets/img/icon-close.png"/>
					<p class="title">提示信息</p>
					<div class="dialog">
			      		<div class="dialogCont">{{alertCont}}</div>
			      		<div class="btn-ground">
			      			<button v-if="type=='confirm'" type="button" @click="confirmBtn">确定</button>
			      			<button v-else type="button" @click="closeMyself">确定</button>
			      		</div>
			      	</div>
				</div>
			</transition>
			
		</div>
	</div>
</template>

<script>
export default {
  props: {
  	// 类型包括 defalut 默认， danger 危险， confirm 确认，
    type:{
        type: String,
        default: 'default'
    },
    isShow: {
      type: Boolean,
      default: false
    },
    alertCont: {
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
    },
    confirmBtn(){
        this.$emit('confirm');
        this.closeMyself();
    }
  }
}
</script>

<style scoped>
@import '../../assets/css/dialogCont.css';	
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

.dialog-cover {
  background: rgba(0,0 ,0 ,0.3);
  position: fixed;
  z-index: 5;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.dialog-content {
  width: 410px;
  position: fixed;
  min-height: 350;
  overflow: auto;
  background: #fff;
  top: 50%;
  left: 50%;
  margin-left: -225px;
  margin-top: -100px;
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