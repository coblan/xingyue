require('./styl/block_pos.styl')

window.live_block_pos={
    props:['ctx'],
    basename:'live-block-pos',
    template:`<div class="com-live-block-pos general-page">
    <div class="scroll-area">
           <div class="banner">
            <img src="/static/images/block/back_区位图底图.jpg" alt="">
        </div>
        <div class="devid-line title-line">
            <img src="/static/images/pic_分割线.png" alt="">
        </div>
        <div class="mytitle">
            <span>天府新区核心居住区区位图</span>
        </div>
        <div class="right-title">
            <span>区位图</span>
        </div>
       <com-btn-back class="normal-back-btn"></com-btn-back>

    </div>
    </div>`,
    mounted(){
        if(ex.os.isTablet){
            var hh = window.innerWidth / 0.563
            $(this.$el).find('.scroll-area').height( hh +'px')
        }
    },
    methods:{
    }
}