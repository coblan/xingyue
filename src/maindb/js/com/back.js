require('./styl/back.styl')

Vue.component('com-btn-back',{
    template:`<div class="com-btn-back" @click="back()">
        <img src="/static/images/page500/button_返回.png" alt="">
    </div>`,
    methods:{
        back(){
            history.back()
        }
    }
})