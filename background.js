var reverse = false;
var shuffle = false;

// todo use 'browser' everywhere
var browser = browser || chrome;

function loadSettings()
{
    chrome.storage.sync.get(["shuffle", "reverse"], function(cfg) { 
        reverse = cfg.reverse;
        shuffle = cfg.shuffle;
    });
}

loadSettings();

function updateTabUrl(tabId, newUrl)
{
    chrome.tabs.update(tabId, {url: newUrl});
}

function pickNext(tab)
{
	function pickNonShuffle(items, begin, end) {
		var found = false;
		
		var n = items.length;
		var a = !reverse ? begin : end-1;
		var b = !reverse ? end-1 : begin;
		var d = !reverse ? 1 : -1;

		for (var i = a; i != b; i += d) {
			if (found && items[i].url && items[i].url.indexOf(".youtube.com/watch") != -1) {
                updateTabUrl(tab.id, items[i].url);
				return true;
			}

			found |= items[i].url == tab.url;
		}

		return false;
	}
	
	function pickShuffle(items, begin, end) {
		if (! (begin < end)) return;

		var cur;
		for (cur=begin; cur<end; cur++)
			if (items[cur].url == tab.url)
				break;
		
		if (cur == end)
			cur = begin;

		for (;;) {
			var n = end - begin;
			var r = Math.floor(Math.random() * (n - 1));
			var next = begin + (cur + 1 + r) % n;

			if (items[next].url && items[next].url.indexOf(".youtube.com/watch") != -1) {
                updateTabUrl(tab.id, items[next].url);
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
		
		if (shuffle || !pickNonShuffle(items, begin, end))
			pickShuffle(items, begin, end);
	});
}

chrome.browserAction.onClicked.addListener(function(tab__unused) {
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        if (!tabs[0]) return;
        
        if (tabs[0].url.indexOf(".youtube.com") != -1) {
	        pickNext(tabs[0]);
            return;
        }
	
        chrome.tabs.query({'url': "https://*.youtube.com/*"}, function (tabs) {
            if (tabs[0]) {
    	        pickNext(tabs[0]);
                return;
            }

            alert("Open a youtube tab first.");
        });
    });
});

browser.runtime.onMessage.addListener(function(msg, sender) {
    if (msg.name == "settings-changed") {
        loadSettings();
    } else if (msg.name == "video-ended") {
		pickNext(sender.tab);
    }
});
