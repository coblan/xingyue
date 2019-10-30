require('./styl/menu_circle_sm.styl')

Vue.component('com-menu-circle-sm',{
    template:`<div class="com-menu-circle-sm">
    <div class="mybtn main-menu" @click="is_open = !is_open">
        <img src="/static/images/2d3d/button_菜单1.png" alt="">
    </div>
    <div v-show="is_open">
        <div class="mybtn back-btn" @click="back()">
            <img src="/static/images/page500/button_返回.png" alt="">
        </div>
          <div class="mybtn btn-first-page" @click="home()">
            <img src="/static/images/2d3d/button_首页.png" alt="">
        </div>
    </div>

    </div>`,
    data(){
        return {
            is_open:false
        }
    },
    methods:{
        home(){
            location = '/'
        },
        back(){
            history.back()
        }
    }
})