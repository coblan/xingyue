require('./styl/menu_vertical_d.styl')

Vue.component('com-menu-vertical-d',{

    template:`<div class="com-menu-vertical-d">
    <div class="mybtn f1" @click="open_d1()">
        <img v-if="parStore.ctx.crt_btn !='d1'" src="/static/images/2d3d/button_D1.png" alt="">
        <img v-else src="/static/images/2d3d/button_D1灰.png" alt="">
    </div>
    <div class="mybtn f2" @click="open_d2()">
        <img v-if="parStore.ctx.crt_btn !='d2'" src="/static/images/2d3d/button_D2.png" alt="">
         <img v-else src="/static/images/2d3d/button_D2灰.png" alt="">
    </div>
     <div class="mybtn f3" @click="open_d3()">
        <img  v-if="parStore.ctx.crt_btn !='d3'" src="/static/images/2d3d/button_D3.png" alt="">
        <img v-else src="/static/images/2d3d/button_D3灰.png" alt="">
    </div>

    </div>`,
    data(){
        return {
            parStore:ex.vueParStore(this)
        }
    },
    methods:{
        open_d1(){
            if(this.parStore.ctx.crt_btn!='d1'){
                location = '/mb/page3d?page=xing_kong'
            }
            //if(this.parStore.ctx.active !=0){
            //    live_root.open_live('live_page_3d',{menu_circle:'com-menu-circle-lg',menu_vertical:'com-menu-vertical-d',active:0})
            //}
        },
        open_d2(){
            if(this.parStore.ctx.crt_btn!='d2') {
                location = '/mb/page3d?page=xing_yue'
            }
        },
        open_d3(){
            if(this.parStore.ctx.crt_btn!='d3'){
                    location = '/mb/page3d?page=xing_hai'
            }

        }
    }
})