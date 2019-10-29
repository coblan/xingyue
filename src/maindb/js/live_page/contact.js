require('./styl/contact.styl')

window.live_contact={
    props:['ctx'],
    basename:'live-contact',
    template:`<div class="com-live-contact">
     <div class="contace0" >
            <img src="/static/images/button_联系方式_1.png" alt="">
        </div>
    <div class="contace1">
        <img src="/static/images/contact/txt_联系1.png" alt="">
    </div>
    <div class="contact2">
        <img src="/static/images/contact/txt_联系2.png" alt="">
    </div>
    <div class="contact3">
        <img src="/static/images/contact/txt_联系3.png" alt="">
    </div>
   <com-btn-back class="normal-back-btn"></com-btn-back>
    </div>`,
    methods:{
    }
}