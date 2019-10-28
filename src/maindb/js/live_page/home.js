require('./styl/home.styl')

window.live_home={
    props:['ctx'],
    basename:'live-home',
    template:`<div class="com-live-home">

    <div class="middle-wrap">
       <div class="mybtn btn_500" @click="on_click()">
        <img src="/static/images/button_500_1.png" alt="">
       <div class="mytitle">品<span>牌</span></div>
        </div>
    </div>
    </div>`,
    methods:{
        on_click(){
            cfg.showMsg('点击500')
        }
    }
}