window.play_music = (music)=>{
    //var audio = document.createElement("AUDIO")
    //document.body.appendChild(audio);
    ////audio.loop = 'loop'
    //audio.src = music

    //document.body.addEventListener("mousemove", function () {
    //    audio.play()
    //})
    //document.addEventListener('click', function () {
    //    audio.play()
    //});
    var audio= new Audio(music)
    audio.loop=true
    setInterval(()=>{
        audio.play().catch(function(error) {
            console.log(error)
        })
        console.log('play')
    },5000)
    document.addEventListener('click', function(){
        audio.play()
    });

    //document.addEventListener('touchend', function () {
    //    audio.play()
    //});
}