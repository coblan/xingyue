require('./styl/menu_vertical.styl')

Vue.component('com-menu-vertical',{
    template:`<div class="com-menu-vertical">
    <div class="mybtn f1" @click="open_help()">
        <img src="/static/images/2d3d/button_F1.png" alt="">
    </div>
    <div class="mybtn f2">
        <img src="/static/images/2d3d/button_F2.png" alt="">
    </div>

    </div>`,
    methods:{
        open_help(){
            cfg.pop_small('com-pop-help',{})
        }
    }
})