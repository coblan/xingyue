from helpers.director.engine import BaseEngine,page
from helpers.director.base_data import inspect_dict

from helpers.director.engine import BaseEngine, page, fa, can_list, can_touch
from django.contrib.auth.models import User, Group
from helpers.func.collection.container import evalue_container

from django.utils.translation import ugettext as _
from django.conf import settings
from helpers.director.access.permit import has_permit
from helpers.mobile.base_data import mb_page_dc

# 移动页面
mb_page={}
inspect_dict['mb_page']= mb_page


class MBpageEngine(BaseEngine):
    url_name='mb_page'
    need_login=False
    access_from_internet=True
    login_url='/mb/login'
    menu=[{'label':'user_info','url':page('user_buyrecord')},
          {'label':'user_washrecord','url':page('user_washrecord')},
          {'label':'user_info','url':page('user_info')},
          
          ]
    def custome_ctx(self, ctx):
        if 'extra_js' not in ctx:
            ctx['extra_js'] = []
        if 'xingyue' not in ctx['extra_js']:
            ctx['extra_js'].append('xingyue')
        #ctx['extra_js'].append('moment')
        return ctx

MBpageEngine.add_pages(mb_page)
MBpageEngine.add_pages(mb_page_dc)