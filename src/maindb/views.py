from django.shortcuts import render,HttpResponse
from django.conf import settings
# Create your views here.

def get_musice(request):
    html = '''
          <audio controls="controls" autoplay="autoplay" preload="auto" loop>
                  <source src="%(media)s/mp3/Music.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
                </audio>
    '''%{'media':settings.BIG_MEDIA}
    return HttpResponse(html)
