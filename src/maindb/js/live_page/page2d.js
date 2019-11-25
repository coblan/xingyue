require('./styl/page2d.styl')

window.live_page_2d={
    props:['ctx'],
    basename:'live-page-2d',
    template:`<div class="com-live-page-2d">
    <div class="content">
        <img  :src="ctx.img_url" alt="">
    </div>
    <component :is="ctx.menu_circle"></component>
    <iframe v-if="ctx.music" src="/music" allow="autoplay" frameborder="0" style="display: none" ></iframe>
    </div>`,
    data(){
        var childStore = new Vue()
        childStore.ctx = this.ctx
        return {
            childStore:childStore
        }
    },
    mounted(){
        if(this.ctx.music){
            play_music(this.ctx.music)
        }
    },
    methods:{
    }
}