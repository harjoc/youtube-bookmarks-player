chrome.storage.sync.get([
            "reverse", 
            "shuffle",
        ], function(cfg) {
    chrome.extension.sendMessage({name: "settings-changed", cfg});
});

document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get([
                "reverse", 
                "shuffle",
            ], function(cfg) {
        var reverseCheck = document.getElementById('reverse');
        var shuffleCheck = document.getElementById('shuffle');

        reverseCheck.checked = cfg.reverse;
        shuffleCheck.checked = cfg.shuffle;
        
        function collect()
        {
            chrome.storage.sync.set({
                reverse: reverseCheck.checked,
                shuffle: shuffleCheck.checked,
            });
            chrome.extension.sendMessage({
                name: "settings-changed", 

                reverse: reverseCheck.checked,
                shuffle: shuffleCheck.checked,
            });
        }

        reverseCheck.addEventListener('click', collect);
        shuffleCheck.addEventListener('click', collect);
    });
});
