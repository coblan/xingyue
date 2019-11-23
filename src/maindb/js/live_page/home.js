require('./styl/home.styl')

window.live_home={
    props:['ctx'],
    basename:'live-home',
    template:`<div class="com-live-home" >

    <div class="scroll-area" :class="{'btn-animate':btn_animate}">
        <div class="middle-wrap">
              <div class="light">
                    <img src="/static/images/动画-光圈.png" alt="">
                </div>
                <div class="liuxing">
                    <img src="/static/images/动画-流星.png" alt="">
                </div>


                   <div class="mybtn btn_500 fade-in-btn" @click="open_500()">
                        <img src="/static/images/button_500_1.png" alt="">
                       <div class="mytitle">品<span>牌</span></div>
                    </div>
                   <div class="mybtn btn_block fade-in-btn" :class="{active:crt_model=='block'}" @click="open_block()">
                        <img src="/static/images/button_区域_1.png" alt="">
                       <div class="mytitle">区<span>域</span></div>
                    </div>
                   <div class="mybtn produce fade-in-btn" :class="{active:crt_model=='product'}" @click="open_product()">
                        <img src="/static/images/button_产品_1.png?v=1" alt="">
                       <div class="mytitle">产<span>品</span></div>
                   </div>

                    <!--<div class="mybtn contact" @click="open_contact()">-->
                        <!--<img src="/static/images/button_联系方式_1.png" alt="">-->
                       <!--<div class="mytitle">联系方<span>式</span></div>-->
                    <!--</div>-->
                     <div class="mybtn contact fade-in-btn" @click="open_video()">
                        <img src="/static/images/button_播放.png" alt="">
                       <div class="mytitle">宣传<span>片</span></div>
                    </div>



            <!--<transition name="btn-fade">-->
                 <div v-if="crt_model=='block'">
                       <div class="mybtn block-posion after-btn fade-in-btn" @click="open_block_pos()">
                            <img src="/static/images/block_btn/区位.png" alt="">
                        </div>
                         <div class="mybtn six after-btn fade-in-btn" @click="open_six()">
                            <img src="/static/images/block_btn/一湾六核.png" alt="">
                        </div>
                         <div class="mybtn garden after-btn fade-in-btn" @click="open_garden()">
                            <img src="/static/images/block_btn/公园配套.png" alt="">
                        </div>
                 </div>
             <!--</transition>-->
                <!--<transition name="btn-fade">-->
                        <div v-if="crt_model=='product'">
                       <div class="mybtn overloap-btn after-btn fade-in-btn" @click="open_overlap()">
                            <img src="/static/images/product/button_叠拼_1.png" alt="">
                        </div>
                         <div class="mybtn tall-build after-btn fade-in-btn" @click="open_tall_build()">
                            <img src="/static/images/product/button_高层_1.png" alt="">
                        </div>
                         <div class="mybtn fashion after-btn fade-in-btn" @click="open_yang_fang()">
                            <img src="/static/images/product/button_洋房_1.png" alt="">
                        </div>
                      </div>
                <!--</transition>-->
            </div>

            <transition name="fade">
               <div class="my-model whole-page" v-show="crt_model!=''" @click="crt_model=''"></div>
            </transition>
        </div>

    </div>`,
    data(){
        return {
            crt_model:'',
            show:false,
            btn_animate:true,
            //show_light:true,
        }
    },
    mounted(){

        if(ex.os.isTablet){
            var hh = window.innerWidth / 0.563
            $(this.$el).find('.scroll-area').height( hh +'px')
            //$('#main-panel').css('overflow','auto')
        }
        Vue.nextTick(()=>{
            live_root.link_ctx = this.ctx.link_ctx

            //window.audio= new Audio(this.ctx.musice)
            //var self =this
            //function play(){
            //    window.audio.autoplay = true
            //    window.audio.play()
            //
            //}
            //document.addEventListener('click', play);
            //document.addEventListener('touchend', play);

            })

        play_music(this.ctx.musice)


    },

    methods:{
        activated(){
            //setTimeout(()=>{
            //    this.btn_animate=true
            //},500)
        },
        deactivated(){
            this.btn_animate=false
        },
        open_video(){
            //live_root.open_live('live_video_page',{src:this.ctx.video_src})
            location = '/mb/video?page=ad_video'
        },
        open_500(){
            live_root.open_live('live_page500',{})
        },
        open_block(){

            if(!this.crt_model){
                this.crt_model='block'
            }else{
                this.crt_model =''
            }

        },
        open_contact(){
            live_root.open_live('live_contact',{})
        },
        open_block_pos(){
            //live_root.open_live('live_block_pos',{})
            live_root.open_live('live_page_2d',this.ctx.link_ctx.block_image)

        },
        open_six(){
            //live_root.open_live('live_six',{})
            live_root.open_live('live_page_2d',this.ctx.link_ctx.one_six)
        },
        open_garden(){
            //live_root.open_live('live_garden',{})
            live_root.open_live('live_page_2d',this.ctx.link_ctx.garden)
        },
        open_product(){
            if(!this.crt_model){
                this.crt_model='product'
            }else{
                this.crt_model =''
            }

        },
        open_overlap(){
            location = '/mb/page3d?page=overlap'
            //live_root.open_live('live_page_3d',this.ctx.link_ctx.overlap)
            //live_root.open_live('live_page_3d',{menu_circle:'com-menu-circle-sm',menu_vertical:'com-menu-vertical-d',link3d:named_ctx.first3d})
            //live_root.open_live('live_page_3d',{menu_circle:'com-menu-circle',menu_vertical:'com-menu-vertical'})
        },
        open_tall_build(){

            //location = '/mb/page2d?page=tall_buiding_2d'

            live_root.open_live('live_page_2d',this.ctx.link_ctx.tall_buiding_2d)

            //live_root.open_live('live_page_2d',{menu_circle:'com-menu-circle',content_img:'/static/images/2d3d/pic_高层户型图.jpg'})
        },
        open_yang_fang(){
            //location = '/mb/page2d?page=yang_fang_2d'
            live_root.open_live('live_page_2d',this.ctx.link_ctx.yang_fang_2d)
        }
    }
}