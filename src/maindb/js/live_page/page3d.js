require('./styl/page3d.styl')

window.live_page_3d={
    props:['ctx'],
    basename:'live-page-3d',
    template:`<div class="com-live-page-3d">
    <component :is="ctx.menu_circle"></component>
     <component :is="ctx.menu_vertical" ></component>

     <iframe v-show="is_show"  :src="ctx.link3d" style="width: 100%;height: 100%"></iframe>
     <!--<iframe allowvr="yes" scrolling="no"  :src="ctx.link3d" frameborder="0" width="100%" height="100%"></iframe>-->
     <iframe v-if="ctx.music" src="/music" allow="autoplay" frameborder="0" style="display: none" ></iframe>
    </div>`,
    data(){
        var childStore = new Vue()
        childStore.ctx = this.ctx
        return {
            childStore:childStore,
            myurl:'',
            is_show:false
        }
    },
    mounted(){
        if(this.ctx.show_help){
            cfg.pop_small('com-pop-help',{})
        }
        //setTimeout(()=>{
        //    this.myurl=this.ctx.link3d
        //    setTimeout(()=>{
        //        //this.myurl=this.ctx.link3d
        //        this.is_show=true
        //    },500)
        //},500)
        setTimeout(()=>{
            this.is_show=true
        },500)
        //if(this.ctx.music){
        //    play_music(this.ctx.music)
        //}

    },
    methods:{
    }
}