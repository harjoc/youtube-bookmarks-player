document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get([
                "disable",
                "reverse", 
                "shuffle",
                "folder",
            ], function(cfg) {

        var enableCheck = document.getElementById('enable');
        var reverseCheck = document.getElementById('reverse');
        var shuffleCheck = document.getElementById('shuffle');
        var folderEdit = document.getElementById('folder');
        
        var setBtn = document.getElementById('set');
        
        enableCheck.checked = !cfg.disable;
        reverseCheck.checked = cfg.reverse;
        shuffleCheck.checked = cfg.shuffle;
        folderEdit.value = cfg.folder || "playlist";
    
        function collect()
        {
            chrome.storage.sync.set({
                disable: !enableCheck.checked,
                reverse: reverseCheck.checked,
                shuffle: shuffleCheck.checked,
                folder: folderEdit.value,
            }, function(result) {
                chrome.extension.sendMessage({name: "settings-changed"});
            });
        }

        enableCheck.addEventListener('click', collect);
        reverseCheck.addEventListener('click', collect);
        shuffleCheck.addEventListener('click', collect);

        folderEdit.addEventListener('change', collect);
        setBtn.addEventListener('click', collect);
    });
});
