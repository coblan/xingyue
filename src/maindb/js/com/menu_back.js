
//require('./styl/menu_back.styl')

Vue.component('com-menu-back',{
    template:`<div class="com-menu-back com-menu-circle-2d com-menu-circle">
    <!--<div class="mybtn main-menu" @click="is_open = !is_open">-->
        <!--<img src="/static/images/2d3d/button_菜单1.png" alt="">-->
    <!--</div>-->
     <div class="mybtn main-menu" @click="back()">
           <img src="/static/images/page500/button_返回.png" alt="">
     </div>


    </div>`,
    data(){
        return {
            is_open:true,
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
        },
        goto_720(){
            location ='/mb/page720?page=' + this.parStore.ctx.page_720
        }
    }
})