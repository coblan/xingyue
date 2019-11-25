window.play_music = (music)=>{
    setTimeout(()=>{
        var ccd =$(document.getElementById('iframeChild').contentWindow.document).find('audio')
        var audio = ccd[0]
        //var audio= new Audio(music)
        audio.loop=true
        setInterval(()=>{
            audio.play().catch(function(error) {
                console.log(error)
            })
            console.log('play')
        },5000)
        document.addEventListener('click', function(){
            audio.play().catch(function(error) {
                console.log(error)
            })
        },false);
    },500)


    //document.addEventListener('touchend', function () {
    //    audio.play()
    //});
}