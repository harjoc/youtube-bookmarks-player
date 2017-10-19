var reverse = false;

chrome.extension.onMessage.addListener(function(msg, sender) {
    if (msg.name == "setting-changed") {
        reverse = msg.reverse;
    } else if (msg.name != "video-ended") {
        function walk(items, dir) {
            var found = false;
            
            alert(2);

            var n = items.length;
            var a = (dir>0) ? 0 : n-1;
            var b = (dir>0) ? n : -1;

            for (var i = a; i != b; i += dir) {
                if (found && items[i].url && items[i].url.indexOf("youtube.com") != -1) {
                    alert("i " + i);
                    chrome.tabs.update(sender.tab.id, {url: items[i].url});
                    return true;
                }

                found |= items[i].url == sender.tab.url;
            }

            alert("4");

            return false;
        }
        
        alert(1);

        chrome.bookmarks.search({}, function(items) {
            alert("reverse " + reverse);
            var dir = reverse ? -1 : 1;
            
            walk(items, dir);
        });
    }
});
