require('./styl/page3d.styl')

window.live_page_3d={
    props:['ctx'],
    basename:'live-page-3d',
    template:`<div class="com-live-page-3d">
    <component :is="ctx.menu_circle"></component>

     <component :is="ctx.menu_vertical"></component>
    </div>`,
    methods:{
    }
}