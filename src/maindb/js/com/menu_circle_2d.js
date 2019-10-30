

Vue.component('com-menu-circle-2d',{
    template:`<div class="com-menu-circle-2d com-menu-circle">
    <div class="mybtn main-menu" @click="is_open = !is_open">
        <img src="/static/images/2d3d/button_菜单1.png" alt="">
    </div>
    <div v-show="is_open">

        <div class="mybtn back-btn" @click="back()">
            <img src="/static/images/page500/button_返回.png" alt="">
        </div>
         <div class="mybtn btn-720" @click="goto_po()">
            <img src="/static/images/2d3d/button_剖切户型1.png" alt="">
        </div>
          <div class="mybtn btn-first-page" >
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
        goto_po(){
            location ='/mb/page3d?page=' + this.parStore.ctx.po_3d
            //live_root.open_live('live_page_3d',{menu_circle:'com-menu-circle',menu_vertical:'com-menu-vertical'})
        },
        back(){
            history.back()
        }
    }
})