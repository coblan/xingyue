require('./styl/page2d.styl')

window.live_page_2d={
    props:['ctx'],
    basename:'live-page-2d',
    template:`<div class="com-live-page-2d">
    <div class="content">
        <img  :src="ctx.img_url" alt="">
    </div>
    <component :is="ctx.menu_circle"></component>
    </div>`,
    data(){
        var childStore = new Vue()
        childStore.ctx = this.ctx
        return {
            childStore:childStore
        }
    },
    methods:{
    }
}