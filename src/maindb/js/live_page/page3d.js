require('./styl/page3d.styl')

window.live_page_3d={
    props:['ctx'],
    basename:'live-page-3d',
    template:`<div class="com-live-page-3d">
    <component :is="ctx.menu_circle"></component>
     <component :is="ctx.menu_vertical" ></component>
     <iframe :src="ctx.link3d" style="width: 100%;height: 100%"></iframe>
    </div>`,
    data(){
        var childStore = new Vue()
        childStore.ctx = this.ctx
        return {
            childStore:childStore
        }
    },
    mounted(){
        if(this.ctx.show_help){
            cfg.pop_small('com-pop-help',{})
        }
    },
    methods:{
    }
}