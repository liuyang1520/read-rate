'use strict';

(function() {
  chrome.runtime.onInstalled.addListener(details => {
    console.log('previousVersion', details.previousVersion);
  });

  let estimate = null

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.type) {
      case 'set_content':
        chrome.storage.sync.get(['settings_read_rate'], (result) => {
          if (result.settings_read_rate != null) {
            let minutes = Math.floor(request.content.length / result.settings_read_rate)
            chrome.browserAction.setBadgeText({text: minutes + ''})
            estimate = {
              hours: Math.floor(minutes / 60),
              minutes: Math.floor(minutes % 60),
              seconds: 0
            }
            sendResponse({nice: "goodbye"})
          }
        })
        break
      case 'get_estimate':
        if (estimate != null) {
          sendResponse({estimate: estimate})
        }
        break
      default:
        sendResponse({})
    }
  })
})();
