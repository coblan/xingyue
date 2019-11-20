require('./styl/page500.styl')

window.live_page500={
    props:['ctx'],
    basename:'live-page500',
    template:`<div class="com-live-page500 general-page">
    <!--<div class="mytitle">-->
        <!--<img src="/static/images/page500/txt_品牌logo.png" alt="">-->
    <!--</div>-->
    <!--<div class="mytitle2">-->
        <!--<img src="/static/images/page500/txt_品牌1.png" alt="">-->
    <!--</div>-->
    <div class="scroll-area">
        <div class="mytitle">
            <img src="/static/images/page500/txt_品牌_new.png" alt="">
        </div>
        <div class="right-title">
            <span>品牌</span>
        </div>
       <com-btn-back class="normal-back-btn "></com-btn-back>
    </div>

    </div>`,
    mounted(){
        if(ex.os.isTablet){
            var hh = window.innerWidth / 0.563
            $(this.$el).find('.scroll-area').height( hh +'px')
        }
    },
    methods:{
        // page500-back-btn
    }
}