from helpers.director.base_data import js_tr_list, js_lib_list
from helpers.maintenance.update_static_timestamp import js_stamp_dc

def get_lib(request): 
    dc = {
        'xingyue': '/static/js/xingyue.pack.js?t=%s&v=1'%js_stamp_dc.get('xingyue_pack_js'),
    }
    return dc

js_lib_list.append(get_lib)