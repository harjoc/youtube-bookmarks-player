chrome.extension.onMessage.addListener(function(msg, sender) {
    if (msg.name != "video-ended") 
        return;

    chrome.bookmarks.search({}, function(items) {
        var found = false;

        for (var i=0; i<items.length; i++) {
            if (found && items[i].url) {
                chrome.tabs.update(sender.tab.id, {url: items[i].url});
                break;
            }

            found |= items[i].url == sender.tab.url;
        }
    });
});
