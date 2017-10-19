if (window == top) {
    var video = document.getElementsByTagName('video')[0];
    if (video)
        video.addEventListener("ended", function() {
            chrome.extension.sendMessage({name: "video-ended"});
        });
}
