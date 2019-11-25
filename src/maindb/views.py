from django.shortcuts import render,HttpResponse
from django.conf import settings
# Create your views here.

def get_musice(request):
    mp3= 'https://s3.ssl.qhres.com/static/b35b351614bf68c2.mp3'
    mp3 = settings.BIG_MEDIA + '/mp3/Music.mp3'
    html = '''
          <audio id="jjyy" controls="controls" autoplay="autoplay" preload="auto" loop>
                  <source src="%(mp3)s" type="audio/mpeg" />
                Your browser does not support the audio element.
                </audio>
    '''%{'mp3':mp3}
    return HttpResponse(html)
