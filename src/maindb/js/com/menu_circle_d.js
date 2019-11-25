require('./styl/menu_circle_lg.styl')

Vue.component('com-menu-circle-d',{
    template:`<div class="com-menu-circle-d">
    <!--<div class="mybtn main-menu" @click="is_open = !is_open">-->
        <!--<img src="/static/images/2d3d/button_菜单1.png" alt="">-->
    <!--</div>-->
     <div class="mybtn main-menu" @click="is_open = !is_open">
           <img v-if="parStore.ctx.crt_btn =='d1'" src="/static/images/2d3d/button_D1.png" alt="">
           <img v-if="parStore.ctx.crt_btn =='d2'" src="/static/images/2d3d/button_D2.png" alt="">
           <img  v-if="parStore.ctx.crt_btn =='d3'" src="/static/images/2d3d/button_D3.png" alt="">
    </div>
     <transition name="btn-fade">
        <div v-show="is_open">
            <div class="mybtn back-btn" @click="back()">
                <img src="/static/images/page500/button_返回.png" alt="">
            </div>
             <div class="mybtn btn-house" @click="open_house()">
                <img src="/static/images/2d3d/户型.png" alt="">
            </div>
            <div class="mybtn btn-po" @click="goto_po()">
                <img src="/static/images/2d3d/button_剖切户型1.png" alt="">
            </div>

            <div class="mybtn btn-720"  @click="goto_720()">
                <img src="/static/images/2d3d/button_720.png" alt="">
            </div>

            <!--<div class="mybtn btn-first-page" @click="home()">-->
                <!--<img src="/static/images/2d3d/button_首页.png" alt="">-->
            <!--</div>-->

        </div>
    </transition>

    </div>`,
    data(){
        return {
            is_open:true,
            parStore:ex.vueParStore(this)
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
        open_house(){
            live_root.open_page('/mb/page2d?page='+this.parStore.ctx.page2d)
            //location='/mb/page2d?page='+this.parStore.ctx.page2d
            //var active =this.parStore.ctx.active
            //live_root.open_live('live_page_2d',{menu_circle:'com-menu-circle-2d',content_img:named_ctx.product[active].image_2d})
        },
        goto_po(){
            live_root.open_page('/mb/page3d?page=' + this.parStore.ctx.po_3d)
            //location ='/mb/page3d?page=' + this.parStore.ctx.po_3d
        },
        goto_720(){
            live_root.open_page('/mb/page720?page=' + this.parStore.ctx.page_720)
            //location ='/mb/page720?page=' + this.parStore.ctx.page_720
        }
    }
})