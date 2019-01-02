<template>
  <div>
    <div v-if="show" id="container">
      <!-- <div class='pdf-page'> -->
      <canvas id="the-canvas"></canvas>
      <div class="foot" v-if='pdfDoc'>
        <!--<button class='left' @click="onPrevPage">上一页</button>
        <span class="count">{{pageNum}}/{{numPages}}</span>
        <button class='right' @click="onNextPage">下一页</button>
        <button  @click="closePDF">关闭</button>-->
        <span class='left' @click="onPrevPage"></span>
        <span class="count">{{pageNum}}/{{numPages}}</span>
        <span class='right' @click="onNextPage"></span>
        <span class="close" @click="closePDF"></span>
        
      </div>
      <!-- </div> -->
    </div>
  </div>

</template>
<script>
import PDFJS from "pdfjs-dist";

export default {
  data() {
    return {
      pdfDoc: null,
      pageNum: 1,
      numPages: 1,
      pageRendering: false,
      pageNumPending: null,
      scale: 1.3,
      show:false
    };
  },
  methods: {
    closePDF(){
      this.show = false;
    },
    showPDF(url) {
      this.show = true;
      let _this = this;
      PDFJS.getDocument(url).then(function(pdf) {
        _this.pdfDoc = pdf;
        _this.renderPage(1);
        _this.numPages = pdf.numPages;
      });
    },
    renderPage(num) {
      this.pageRendering = true;
      let _this = this;
      this.pdfDoc.getPage(num).then(function(page) {
        var viewport = page.getViewport(_this.scale);
        let canvas = document.getElementById("the-canvas");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context
        var renderContext = {
          canvasContext: canvas.getContext("2d"),
          viewport: viewport
        };
        var renderTask = page.render(renderContext);

        // Wait for rendering to finish
        renderTask.promise.then(function() {
          _this.pageRendering = false;
          if (_this.pageNumPending !== null) {
            // New page rendering is pending
            this.renderPage(_this.pageNumPending);
            _this.pageNumPending = null;
          }
        });
      });
    },
    queueRenderPage(num) {
      if (this.pageRendering) {
        this.pageNumPending = num;
      } else {
        this.renderPage(num);
      }
    },
    onPrevPage() {
      if (this.pageNum <= 1) {
        return;
      }
      this.pageNum--;
      this.queueRenderPage(this.pageNum);
    },
    onNextPage() {
      if (this.pageNum >= this.pdfDoc.numPages) {
        return;
      }
      this.pageNum++;
      this.queueRenderPage(this.pageNum);
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
  overflow: auto;
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
	  left: 25%;
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
	  right: 25%;
	  transform: translate(50%, -50%);
}
canvas{
  transform: scale(1);
}
</style>
