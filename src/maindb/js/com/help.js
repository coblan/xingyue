require('./styl/help.styl')

Vue.component('com-pop-help',{
    template:`<div class="com-pop-help">
    <div class="close-btn" @click="get_close()">
        <img src="/static/images/help/button_关闭.png" alt="">
    </div>
     <div class="handle-btn">
        <img src="/static/images/help/pic_教程1.png" alt="">
     </div>
     <div class="handle-btn">
        <img src="/static/images/help/pic_教程2.png" alt="">
     </div>
     <div class="handle-btn">
        <img src="/static/images/help/pic_教程3.png" alt="">
     </div>
     <div class="i-know" @click="get_close()">
     <img src="/static/images/help/button_知道了.png" alt="">
     </div>
    </div>`,
    methods:{
        get_close(){
            this.$emit('finish')
        }
    }
})