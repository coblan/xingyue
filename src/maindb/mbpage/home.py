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
            'init_express':'''ex.each(["/static/images/page500/back_品牌.jpg","/static/images/back_通用底图.jpg"],img=>{
                ex.load_img(img)
            })'''
        }

mb_page.update({
    'index':Home
})