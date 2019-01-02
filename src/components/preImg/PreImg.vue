<template>
  <div>
    <div v-if="show" id="container">
      <!-- <div class='pdf-page'> -->
      <ul class="imgList">
      	<li v-for="(item,index) in imgs">
      		<img :src="item" alt="" v-if="index+1== imgNum"/>
      	</li>
      </ul>
      <div class="foot">
        <!--<button class='left' @click="onPrevImg">上一页</button>
        <span>{{imgNum}}/{{count}}</span>
        <button class='right' @click="onNextImg">下一页</button>
        <button @click="closeImg">关闭</button>-->
        <span class='left' @click="onPrevImg"></span>
        <span class="count">{{imgNum}}/{{count}}</span>
        <span class='right' @click="onNextImg"></span>
        <span class="close" @click="closeImg"></span>
      </div>
      <!-- </div> -->
    </div>
  </div>

</template>
<script>

export default {
  data() {
    return {
      imgNum: 1,
      count: 1,
      show:false,
      imgs:[],
      pageRendering: false,
      pageNumPending: null,
    };
  },
  methods: {
    closeImg(){
      this.show = false;
    },
    showImg(imgs) {
      this.show = true;
      this.count = imgs.length;
      this.imgs = imgs;
      this.imgNum = 1;
    },
    onPrevImg() {
      if (this.imgNum <= 1) {
        return;
      }
      this.imgNum--;
    },
    onNextImg() {
      if (this.imgNum >= this.count) {
        return;
      }
      this.imgNum++;
    }
  }
};
</script>
 
<style scoped>
#container {
  background-color: rgba(0, 0, 0, 0.75);
  position: absolute;
  width: 100%;
  min-height: 100%;
  padding-bottom: 100px;
  top: 80px;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
}

.imgList {
	/*margin-top: 35px;*/
}

.imgList img{
	max-width: 1000px;
	height: auto;
}

.foot {
  /*position: fixed;
  transform: translate(-50%, 0);
  left: 50%;*/
}
.count{
	position: fixed;
  transform: translate(-50%, 0);
  left: 50%;
}
.close {
    position: fixed;
	  right: 5px;
	  top: 85px;
    background: url(../../assets/img/big-close.png) no-repeat center;
    cursor: pointer;
    text-align: center;
    height: 30px;
    width: 30px;
    border-radius: 50%;
}
.left{
		position: fixed;
	  /*left: 28.5%;*/
	  top: 55%;
	  width: 50px;
	  height: 64px;
	  background: url(../../assets/img/left.png) no-repeat center;
	  background-color: rgba(0, 0, 0, 0.3);
	  left: 30%;
	  transform: translate(-50%, -50%);
}
.right{
		position: fixed;
	  /*right: 25%;*/
	  top: 55%;
	  width: 50px;
	  height: 64px;
	  background: url(../../assets/img/right.png) no-repeat center;
	  background-color: rgba(0, 0, 0, 0.3);
	  right: 30%;
	  transform: translate(50%, -50%);
}

</style>
