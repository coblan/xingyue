require('./styl/page500.styl')

window.live_page500={
    props:['ctx'],
    basename:'live-page500',
    template:`<div class="com-live-page500">
    <!--<div class="mytitle">-->
        <!--<img src="/static/images/page500/txt_品牌logo.png" alt="">-->
    <!--</div>-->
    <!--<div class="mytitle2">-->
        <!--<img src="/static/images/page500/txt_品牌1.png" alt="">-->
    <!--</div>-->
    <div class="mytitle">
        <img src="/static/images/page500/txt_品牌_new.png" alt="">
    </div>
    <div class="right-title">
        <span>品牌</span>
    </div>
   <com-btn-back class="normal-back-btn "></com-btn-back>
    </div>`,
    methods:{
        // page500-back-btn
    }
}