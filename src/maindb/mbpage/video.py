from hello.engin_menu import mb_page
from .data import page_ctx

class Videopage(object):
    def __init__(self, request, engin):
        self.request = request
    
    def get_template(self):
        return 'mobile/live.html'
    
    def get_context(self):
        page_name = self.request.GET.get('page')
        my_ctx = page_ctx.get(page_name)
        return {
            'editor_ctx':my_ctx,
            'editor':'live_video_page',
        }

mb_page.update({
    'video':Videopage
})