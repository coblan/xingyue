from hello.engin_menu import mb_page
from django.conf import settings
from .data import page_ctx

class Home(object):
    def __init__(self, request, engin):
        pass
    
    def get_template(self):
        return 'mobile/live_show.html'
    
    def get_context(self):
        return {
             'adapt_size':'fullwidth',
             'editor_ctx':{
                 'link_ctx':page_ctx,
                 'video_src': settings.BIG_MEDIA + '/video/中铁·星月山湖 网络版 11.13~1.mp4',
            },
            'editor':'live_home',
            'init_express':'''ex.each(["/static/images/page500/back_品牌.jpg","/static/images/back_通用底图.jpg"],img=>{
                ex.load_img(img)
            })'''
        }

mb_page.update({
    'index':Home
})