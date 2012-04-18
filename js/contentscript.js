function __getLocalStorage()
{
	return localStorage;
}

// connect to background.html
var port = chrome.extension.connect({name: 'contentscript'});

// get new localstroage, set it
port.onMessage.addListener(function(msg) {
    var _newLocalStorage = JSON.parse(msg);
	var _oldLocalStorage = __getLocalStorage();
	
	_oldLocalStorage.clear();
	
    for(var key in _newLocalStorage)
    {
    	_oldLocalStorage.setItem(key, _newLocalStorage[key]);
    }
    
    // send the new localStorage to background.html
	chrome.extension.sendRequest({'route': 'contentscript', 'data': JSON.stringify(localStorage)});
});

// send localStorage to background.html
chrome.extension.sendRequest({'route': 'contentscript', 'data': JSON.stringify(localStorage)});