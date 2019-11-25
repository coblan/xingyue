require('./styl/menu_vertical.styl')

Vue.component('com-menu-vertical',{
    template:`<div class="com-menu-vertical">
    <div class="mybtn f1" @click="open_f1()">
        <img src="/static/images/2d3d/button_F1.png" alt="">
    </div>
    <div class="mybtn f2" @click="open_f2()">
        <img src="/static/images/2d3d/button_F2.png" alt="">
    </div>

    </div>`,
    data(){
        return {
            parStore:ex.vueParStore(this)
        }
    },
    methods:{
        //open_help(){
        //    cfg.pop_small('com-pop-help',{})
        //}
        open_f1(){
            if(this.parStore.ctx.crt_btn!='f1' && this.parStore.ctx.f1_page){
                var url =ex.appendSearch('/mb/page3d',{page:this.parStore.ctx.f1_page,})
                live_root.open_page(url)

            }
            //if(this.parStore.ctx.active !=0){
            //    live_root.open_live('live_page_3d',{menu_circle:'com-menu-circle-lg',menu_vertical:'com-menu-vertical-d',active:0})
            //}
        },
        open_f2(){
            if(this.parStore.ctx.crt_btn!='f2' && this.parStore.ctx.f2_page){
                var url =ex.appendSearch('/mb/page3d',{page:this.parStore.ctx.f2_page,})
                live_root.open_page(url)
            }
        },
    }
})