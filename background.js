chrome.runtime.onMessageExternal.addListener((data, sender, sendResponse) => {
    chrome.storage.sync.set(data, () => {
		sendResponse("auth data set successfully")
	})
});
