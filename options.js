document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get([
                "disable",
                "reverse", 
                "shuffle",
            ], function(cfg) {

        var enableCheck = document.getElementById('enable');
        var reverseCheck = document.getElementById('reverse');
        var shuffleCheck = document.getElementById('shuffle');
        
        enableCheck.checked = !cfg.disable;
        reverseCheck.checked = cfg.reverse;
        shuffleCheck.checked = cfg.shuffle;
        
        function collect()
        {
            chrome.storage.sync.set({
                disable: !enableCheck.checked,
                reverse: reverseCheck.checked,
                shuffle: shuffleCheck.checked,
            });
            chrome.extension.sendMessage({name: "settings-changed"});
        }

        enableCheck.addEventListener('click', collect);
        reverseCheck.addEventListener('click', collect);
        shuffleCheck.addEventListener('click', collect);
    });
});
