import preImg from './preImg'
 
var $vm
export default {
  install (Vue, options) {
    if (!$vm) {
      const ImgPlugin = Vue.extend(preImg)
      $vm = new ImgPlugin().$mount()
      document.body.appendChild($vm.$el)
    }
    Vue.prototype.$showImg = function (imgs) {
      $vm.showImg(imgs)
    }
  }
}