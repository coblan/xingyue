window.play_music = (music)=>{
    var audio = document.createElement("AUDIO")
    document.body.appendChild(audio);
    //audio.loop = 'loop'
    audio.src = music

    document.body.addEventListener("mousemove", function () {
        audio.play()
    })
    document.addEventListener('click', function () {
        audio.play()
    });
    //document.addEventListener('touchend', function () {
    //    audio.play()
    //});
}