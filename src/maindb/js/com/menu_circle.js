require('./styl/menu_circle.styl')

Vue.component('com-menu-circle',{
    template:`<div class="com-menu-circle">
    <div class="mybtn main-menu" @click="is_open = !is_open">
        <img src="/static/images/2d3d/button_菜单1.png" alt="">
    </div>
     <transition name="btn-fade">
        <div v-show="is_open">
            <div class="mybtn back-btn" @click="back()">
                <img src="/static/images/page500/button_返回.png" alt="">
            </div>
             <div class="mybtn btn-720">
                <img src="/static/images/2d3d/button_720.png" alt="">
            </div>
              <div class="mybtn btn-first-page" @click="home()">
                <img src="/static/images/2d3d/button_首页.png" alt="">
            </div>
        </div>
    </transition>

    </div>`,
    data(){
        return {
            is_open:true
        }
    },
    methods:{
        home(){
            //location = '/'
            live_root.open_page('/')
        },
        back(){
            history.back()
        }
    }
})