require('./styl/video_page.styl')

window.live_video_page={
    props:['ctx'],
    basename:'live-video-page',
    template:`<div class="com-live-video-page">
    <div class="video-content">
        <video :src="ctx.src" autoplay controls width="100%" height="auto"></video>
    </div>
    <com-btn-back class="right-top-back-btn"></com-btn-back>
    </div>`,
    mounted(){
        //if(ex.os.isTablet){
        //    var hh = window.innerWidth / 0.563
        //    $(this.$el).find('.scroll-area').height( hh +'px')
        //}
    },
    methods:{
    }
}