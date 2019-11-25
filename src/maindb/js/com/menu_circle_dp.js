require('./styl/menu_circle_sm.styl')

Vue.component('com-menu-circle-dp',{
    template:`<div class="com-menu-circle-dp">
    <div class="mybtn main-menu" @click="is_open = !is_open">
        <img src="/static/images/2d3d/button_菜单1.png" alt="">
    </div>

     <transition name="btn-fade">
        <div v-show="is_open">
            <div class="mybtn back-btn" @click="back()">
                <img src="/static/images/page500/button_返回.png" alt="">
            </div>
              <div class="mybtn btn-first-page" @click="home()">
                <img src="/static/images/2d3d/button_首页.png" alt="">
            </div>

            <div class="mybtn d1" @click="open_d1()">
                <img  src="/static/images/2d3d/button_D1.png" alt="">
            </div>
            <div class="mybtn d2" @click="open_d2()">
                <img  src="/static/images/2d3d/button_D2.png" alt="">

            </div>
             <div class="mybtn d3" @click="open_d3()">
                <img  src="/static/images/2d3d/button_D3.png" alt="">
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
        },
        open_d1(){
            live_root.open_page('/mb/page3d?page=xing_kong')
            //location = '/mb/page3d?page=xing_kong'
            //live_root.open_live('live_page_3d',live_root.link_ctx.xing_kong)
        },
        open_d2(){
            live_root.open_page('/mb/page3d?page=xing_yue')
            //location = '/mb/page3d?page=xing_yue'
        },
        open_d3(){
            live_root.open_page( '/mb/page3d?page=xing_hai')
            //location = '/mb/page3d?page=xing_hai'
        }
    }
})