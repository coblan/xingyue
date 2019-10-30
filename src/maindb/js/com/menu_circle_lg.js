require('./styl/menu_circle_lg.styl')

Vue.component('com-menu-circle-lg',{
    template:`<div class="com-menu-circle-lg">
    <div class="mybtn main-menu" @click="is_open = !is_open">
        <img src="/static/images/2d3d/button_菜单1.png" alt="">
    </div>
    <div v-show="is_open">
        <div class="mybtn back-btn" @click="back()">
            <img src="/static/images/page500/button_返回.png" alt="">
        </div>
         <div class="mybtn btn-house" @click="open_house()">
            <img src="/static/images/2d3d/户型.png" alt="">
        </div>
        <div class="mybtn btn-720">
            <img src="/static/images/2d3d/button_720.png" alt="">
        </div>
          <div class="mybtn btn-first-page" @click="home()">
            <img src="/static/images/2d3d/button_首页.png" alt="">
        </div>
    </div>

    </div>`,
    data(){
        return {
            is_open:false,
            parStore:ex.vueParStore(this)
        }
    },
    methods:{
        home(){
            location = '/'
        },
        back(){
            history.back()
        },
        open_house(){
            location='/mb/page2d?page='+this.parStore.ctx.page2d
            //var active =this.parStore.ctx.active
            //live_root.open_live('live_page_2d',{menu_circle:'com-menu-circle-2d',content_img:named_ctx.product[active].image_2d})
        }
    }
})