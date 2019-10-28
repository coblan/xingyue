from hello.engin_menu import mb_page

class Home(object):
    def __init__(self, request, engin):
        pass
    
    def get_template(self):
        return 'mobile/live.html'
    
    def get_context(self):
        return {
             'editor_ctx':{
            },
            'editor':'live_home',
        }

mb_page.update({
    'index':Home
})