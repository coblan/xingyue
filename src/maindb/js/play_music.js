window.play_music = (music)=>{
    var audio = document.createElement("AUDIO")
    document.body.appendChild(audio);
    //audio.loop = 'loop'
    audio.src = music

    //document.body.addEventListener("mousemove", function () {
    //    audio.play()
    //})
    //document.addEventListener('click', function () {
    //    audio.play()
    //});

    setInterval(()=>{
        audio.play().catch(function(error) {
            console.log(error)
            // Automatic playback failed.
            // Show a UI element to let the user manually start playback.
        })
        console.log('play')
    },5000)

    //document.addEventListener('touchend', function () {
    //    audio.play()
    //});
}