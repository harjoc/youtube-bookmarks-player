var reverse = false;
var shuffle = false;

chrome.extension.onMessage.addListener(function(msg, sender) {
    if (msg.name == "settings-changed") {
        reverse = msg.reverse;
        shuffle = msg.shuffle;
    } else if (msg.name == "video-ended") {
        function pickShuffle(items) {
            var found = false;
            
            var n = items.length;
            var a = !reverse ? 0 : n-1;
            var b = !reverse ? n : -1;
            var d = !reverse ? 1 : -1;

            for (var i = a; i != b; i += d) {
                if (found && items[i].url && items[i].url.indexOf("youtube.com") != -1) {
                    chrome.tabs.update(sender.tab.id, {url: items[i].url});
                    return true;
                }

                found |= items[i].url == sender.tab.url;
            }

            return false;
        }
        
        function pickNonShuffle(items) {
            for (;;) {
                var i = Math.floor(Math.random() * items.length);
                if (items[i].url && items[i].url.indexOf("youtube.com") != -1) {
                    chrome.tabs.update(sender.tab.id, {url: items[i].url});
                    return;
                }
            }
        }

        function handleResults(items) {
            if (shuffle) {
                pickShuffle(items);
                return;
            }

            var found = pickNonShuffle(items);

            /*if (found) return;
            
            chrome.extension.sendMessage({name: "settings-changed", 
                reverse: reverse,
                shuffle: shuffle,
            });

            walk(items);*/
        }

        chrome.bookmarks.search({title:"music"}, function(musics) {
            if (musics[0]) {
                chrome.bookmarks.getSubTree(musics[0].id, handleResults);
            } else {
                chrome.bookmarks.getTree(handleResults);
            }
        }
    }
});
