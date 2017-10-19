chrome.storage.sync.get(["reverse"], function(list) {
    chrome.extension.sendMessage({name: "setting-changed", reverse: list.reverse});
});

document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get(["reverse"], function(list) {
        var reverseCheck = document.getElementById('reverse');

        reverseCheck.checked = list.reverse;
        
        reverseCheck.addEventListener('click', function() {
            chrome.storage.sync.set({reverse: reverseCheck.checked});
            chrome.extension.sendMessage({name: "setting-changed", reverse: reverseCheck.checked});
        });
    });
});
