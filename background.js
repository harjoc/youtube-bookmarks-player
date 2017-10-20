var reverse = false;
var shuffle = false;

chrome.extension.onMessage.addListener(function(msg, sender) {
    if (msg.name == "settings-changed") {
        reverse = msg.reverse;
        shuffle = msg.shuffle;
    } else if (msg.name == "video-ended") {
        function pickNonShuffle(items, begin, end) {
            var found = false;
            
            var n = items.length;
            var a = !reverse ? begin : end-1;
            var b = !reverse ? end : -1;
            var d = !reverse ? 1 : -1;

            for (var i = a; i != b; i += d) {
                if (found && items[i].url && items[i].url.indexOf("youtube.com/watch") != -1) {
                    chrome.tabs.update(sender.tab.id, {url: items[i].url});
                    return true;
                }

                found |= items[i].url == sender.tab.url;
            }

            return false;
        }
        
        function pickShuffle(items, begin, end) {
            for (;;) {
                var i = Math.floor(Math.random() * (end - begin) + begin);
                if (items[i].url && items[i].url.indexOf("youtube.com/watch") != -1) {
                    chrome.tabs.update(sender.tab.id, {url: items[i].url});
                    return;
                }
            }
        }

        chrome.bookmarks.search({}, function(items) {
            var begin = 0;
            var end = items.length;

            for (var i=0; i<items.length; i++) {
                if (items[i].title == "music" && !items[i].url)
                    begin = i;
                else if (begin && items[i].parentId == items[begin].parentId)
                    end = i;
            }
            
            if (shuffle) {
                pickShuffle(items, begin, end);
                return;
            }

            pickNonShuffle(items, begin, end);
        });
    }
});
