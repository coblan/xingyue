from django.conf import settings

page_ctx={
    'overlap':{
        'link3d':settings.BIG_MEDIA + '/3d/HLT_DP/index.html',
        'menu_circle':'com-menu-circle-sm',
        'menu_vertical':'com-menu-vertical-d',
        'show_help':True
    },
    'xing_kong':{ #D1
        'link3d':settings.BIG_MEDIA +'/3d/HLT_DP_D1/index.html',
        'menu_circle':'com-menu-circle-lg',
        'menu_vertical':'com-menu-vertical-d',
        'page2d':'xing_kong_2d',
        'crt_btn':'d1',
    },
    'xing_kong_2d':{
        'img_url':'/static/images/2d3d/pic_星空独栋户型图.jpg',
        'menu_circle':'com-menu-circle-2d',
        'po_3d':'xing_kong_po'
    },
    'xing_kong_po':{
        'link3d':settings.BIG_MEDIA +'/3d/HLT_D1_1F/index.html',
        'menu_circle':'com-menu-circle',
        'menu_vertical':'com-menu-vertical',
        'crt_btn':'f1',
        'f1_page':'xing_kong_po',
        'f2_page':'xing_kong_po_f2'
    },
    'xing_kong_po_f2':{
        'link3d':settings.BIG_MEDIA +'/3d/HLT_D1_2F/index.html',
        'menu_circle':'com-menu-circle',
        'menu_vertical':'com-menu-vertical',
        'crt_btn':'f2',
        'f1_page':'xing_kong_po',
        'f2_page':'xing_kong_po_f2'
    },
    'xing_yue':{ #D2
        'link3d':settings.BIG_MEDIA +'/3d/HLT_DP_D2/index.html',
        'menu_circle':'com-menu-circle-lg',
        'menu_vertical':'com-menu-vertical-d',
        'page2d':'xing_yue_2d',
        'crt_btn':'d2',
    },
    'xing_yue_2d':{
        'img_url':'/static/images/2d3d/pic_星悦环幕首层户型图.jpg',
        'menu_circle':'com-menu-circle-2d',
        'po_3d':'xing_yue_po'
    },

    'xing_yue_po':{
        'link3d':settings.BIG_MEDIA +'/3d/HLT_D2_1F/index.html',
        'menu_circle':'com-menu-circle',
        'menu_vertical':'com-menu-vertical',
        'crt_btn':'f1',
        'f1_page':'xing_yue_po',
        'f2_page':'xing_yue_po_f2'
    },
    'xing_yue_po_f2':{
        'link3d':settings.BIG_MEDIA +'/3d/HLT_D2_2F/index.html',
        'menu_circle':'com-menu-circle',
        'menu_vertical':'com-menu-vertical',
        'crt_btn':'f2',
        'f1_page':'xing_yue_po',
        'f2_page':'xing_yue_po_f2'
    },
        
    'xing_hai':{ #D3
        'link3d':settings.BIG_MEDIA +'/3d/HLT_DP_D3/index.html',
        'menu_circle':'com-menu-circle-lg',
        'menu_vertical':'com-menu-vertical-d',
        'page2d':'xing_hai_2d',
        'crt_btn':'d3',
    },
    'xing_hai_2d':{
        'img_url':'/static/images/2d3d/pic_星海花园首层.jpg',
        'menu_circle':'com-menu-circle-2d',
        'po_3d':'xing_hai_po'
    },
    'xing_hai_po':{
        'link3d':settings.BIG_MEDIA +'/3d/HLT_D3_1F/index.html',
        'menu_circle':'com-menu-circle',
        'menu_vertical':'com-menu-vertical',
        'crt_btn':'f1',
        'f1_page':'xing_hai_po',
        'f2_page':'xing_hai_po_f2'
    },
     'xing_hai_po_f2':{
        'link3d':settings.BIG_MEDIA +'/3d/HLT_D3_2F/index.html',
        'menu_circle':'com-menu-circle',
        'menu_vertical':'com-menu-vertical',
        'crt_btn':'f2',
        'f1_page':'xing_hai_po',
        'f2_page':'xing_hai_po_f2'
    },
    
    'tall_buiding_2d':{
        'img_url':'/static/images/2d3d/pic_高层户型图.jpg',
        'menu_circle':'com-menu-circle-2d',
        'po_3d':'xing_kong_po'
    },
    'yang_fang_2d':{
        'img_url':'/static/images/2d3d/pic_洋房户型图.jpg?v=1',
        'menu_circle':'com-menu-circle-2d',
        'po_3d':'xing_kong_po'
    }
}