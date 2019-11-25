"""xingyue URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from hello.engin_menu import MBpageEngine
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView 
from maindb import views as maindb_views
urlpatterns = [
    #url(r'^admin/', admin.site.urls),
    url(r'music',maindb_views.get_musice),
    url(r'mb/([\w\.\-]+)',MBpageEngine.as_view(),name= MBpageEngine.url_name),
    url(r'^$',RedirectView.as_view(url='/mb/index')) ,
   
]

if settings.DEBUG:
    urlpatterns = urlpatterns + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)