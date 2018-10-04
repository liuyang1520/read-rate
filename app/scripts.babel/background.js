'use strict';

(function() {
  chrome.runtime.onInstalled.addListener(details => {
    console.log('previousVersion', details.previousVersion);
  });

  let tabInfo = {}

  chrome.tabs.onRemoved.addListener(function(tabId) {
    delete tabInfo[tabId]
  })

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.type) {
      case 'store_content':
        chrome.storage.sync.get(['settings_read_rate'], (result) => {
          if (result.settings_read_rate != null) {
            let minutes = request.content == null ? 0 : Math.floor(request.content.length / result.settings_read_rate)
            tabInfo[sender.tab.id] = {
              hours: Math.floor(minutes / 60),
              minutes: Math.floor(minutes % 60),
              seconds: 0,
              totalMins: minutes
            }
            sendResponse({})
          }
        })
        break
      case 'get_estimate':
        if (tabInfo != null) {
          sendResponse({estimate: tabInfo[request.tabId]})
        }
        break
      default:
        sendResponse({})
    }
  })

  chrome.tabs.onActivated.addListener((activeInfo) => {
    if (tabInfo[activeInfo.tabId] == null) return;
    let totalMins = tabInfo[activeInfo.tabId].totalMins
    chrome.browserAction.setBadgeText({text: totalMins + ''})
  })

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tabInfo[tabId] == null || changeInfo.status != 'complete' || !tab.active) return;
    let totalMins = tabInfo[tabId].totalMins
    chrome.browserAction.setBadgeText({text: totalMins + ''})
  })
})();
