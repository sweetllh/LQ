import DialogComponent from './Dialog.vue'
 
const Dialog = {
    install:function(Vue){
        Vue.component("my-dialog", DialogComponent);
    }  
    //'Header'这就是后面可以使用的组件的名字，install是默认的一个方法
};

export default Dialog;

 
