import AlertCompoment from './AlertDialog.vue'
 
const alertDialog = {
    install:function(Vue){
        Vue.component("alert-dialog", AlertCompoment);
    }  
    //'Header'这就是后面可以使用的组件的名字，install是默认的一个方法
};

export default alertDialog;

 
