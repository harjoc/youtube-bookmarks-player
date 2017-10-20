if (window == top) {
    function next() {
        setTimeout(function() {
            chrome.extension.sendMessage({name: "video-ended"});
        }, 1500);
    }

    var video = document.getElementsByTagName('video')[0];
    if (video) {
        video.addEventListener("ended", next);
    } else if (document.getElementById('player-container')) {
        next();
    }
}
