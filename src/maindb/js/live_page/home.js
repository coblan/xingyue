require('./styl/home.styl')

window.live_home={
    props:['ctx'],
    basename:'live-home',
    template:`<div class="com-live-home">


    <div class="middle-wrap">
       <div class="mybtn btn_500" @click="open_500()">
            <img src="/static/images/button_500_1.png" alt="">
           <div class="mytitle">品<span>牌</span></div>
        </div>
       <div class="mybtn btn_block" @click="open_block()">
            <img src="/static/images/button_区域_1.png" alt="">
           <div class="mytitle">区<span>域</span></div>
        </div>
       <div class="mybtn produce" @click="open_product()">
            <img src="/static/images/button_产品_1.png" alt="">
           <div class="mytitle">产<span>品</span></div>
       </div>

        <div class="mybtn contact" @click="open_contact()">
            <img src="/static/images/button_联系方式_1.png" alt="">
           <div class="mytitle">联系方<span>式</span></div>
        </div>

          <template v-if="crt_model=='block'">
           <div class="mybtn block-posion after-btn" @click="open_block_pos()">
                <img src="/static/images/block_btn/区位.png" alt="">
            </div>
             <div class="mybtn six after-btn" @click="open_six()">
                <img src="/static/images/block_btn/一湾六核.png" alt="">
            </div>
             <div class="mybtn garden after-btn" @click="open_garden()">
                <img src="/static/images/block_btn/公园配套.png" alt="">
            </div>
          </template>

            <template v-if="crt_model=='product'">
           <div class="mybtn overloap-btn after-btn" @click="open_overlap()">
                <img src="/static/images/product/button_叠拼_1.png" alt="">
            </div>
             <div class="mybtn tall-build after-btn" @click="open_tall_build()">
                <img src="/static/images/product/button_高层_1.png" alt="">
            </div>
             <div class="mybtn fashion after-btn" @click="open_garden()">
                <img src="/static/images/product/button_洋房_1.png" alt="">
            </div>
          </template>
    </div>

       <div class="my-model whole-page" v-if="crt_model!=''" @click="crt_model=''">

        </div>
    </div>`,
    data(){
        return {
            crt_model:''
        }
    },
    methods:{
        open_500(){
            live_root.open_live('live_page500',{})
        },
        open_block(){
            this.crt_model='block'
        },
        open_contact(){
            live_root.open_live('live_contact',{})
        },
        open_block_pos(){
            live_root.open_live('live_block_pos',{})
        },
        open_six(){
            live_root.open_live('live_six',{})
        },
        open_garden(){
            live_root.open_live('live_garden',{})
        },
        open_product(){
            this.crt_model='product'
        },
        open_overlap(){
            live_root.open_live('live_page_3d',{menu_circle:'com-menu-circle',menu_vertical:'com-menu-vertical'})
        },
        open_tall_build(){
            live_root.open_live('live_page_2d',{menu_circle:'com-menu-circle',content_img:'/static/images/2d3d/pic_高层户型图.jpg'})
        }
    }
}