require('./styl/garden.styl')

window.live_garden={
    props:['ctx'],
    basename:'live-garden',
    template:`<div class="com-live-garden general-page">
    <div class="banner">
        <img src="/static/images/block/back_公园配套.jpg" alt="">
    </div>
    <div class="title1">
        <span>自然深处.近享醇熟</span>
    </div>
    <div class="title2">
        <span>Starlight Lakeshore</span>
    </div>
    <div class="devid-line title-line">
        <img src="/static/images/pic_分割线.png" alt="">
    </div>
    <div class="title4">
        <div>中铁.星月山湖坐落于中铁黑龙滩.国际旅游度假区的核心板块内,</div>
        <div>被200亩湿地公园环抱。千亩湿地生态公园与规划中的</div>
        <div>四川省人民医院近在咫尺，步行10分钟即达金沙湾国际度假核心区。</div>
        <div>离尘不离城、闹中取静的舒适时光触手可及。</div>
    </div>
     <div class="right-title">
        <span>公园配套</span>
    </div>
   <com-btn-back class="normal-back-btn"></com-btn-back>
    </div>`,
    methods:{
    }
}