require('./styl/page2d.styl')

window.live_page_2d={
    props:['ctx'],
    basename:'live-page-2d',
    template:`<div class="com-live-page-2d">
    <div class="content">
        <img  :src="ctx.content_img" alt="">
    </div>

    <component :is="ctx.menu_circle"></component>
    </div>`,
    methods:{
    }
}