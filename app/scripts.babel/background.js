'use strict';

(function() {
  chrome.runtime.onInstalled.addListener(details => {
    console.log('previousVersion', details.previousVersion);
  });

  let tabInfo = {},
      cache = {}

  chrome.storage.sync.get(['history'], (result) => {
    if (result.history != null) {
      cache = result.history
    }
  })

  chrome.tabs.onRemoved.addListener(function(tabId) {
    delete tabInfo[tabId]
  })

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.type) {
      case 'store_content':
        chrome.storage.sync.get(['settings_read_rate'], (result) => {
          if (result.settings_read_rate != null) {
            let milliseconds = request.content == null ? 0 : Math.floor(request.content.length / result.settings_read_rate * 60000);
            let timeObject = periodToTime(milliseconds);
            tabInfo[sender.tab.id] = {
              title: sender.tab.title, // tab title
              totalMins: timeObject.hours * 60 + timeObject.minutes, // estimated reading time in mins, for badge
              totalMs: milliseconds, // estimated reading time milliseconds
              restMs: milliseconds, // rest reading time, used for pause/resume
              endTime: null, // estimated end time to finish, used when popup is closed
              paused: true,
              finished: false
            };
            sendResponse({});
          }
        })
        break
      case 'get_estimate':
        if (tabInfo == null) return;
        sendResponse({state: tabInfo[request.tabId]})
        break
      case 'sync_time':
        if (tabInfo == null) return;
        tabInfo[request.tabId].restMs = request.restMs
        if (request.action == 'pause') {
          tabInfo[request.tabId].endTime = null
          tabInfo[request.tabId].paused = true
        } else if (request.action == 'resume') {
          tabInfo[request.tabId].endTime = getEndTime(request.restMs)
          tabInfo[request.tabId].paused = false
        } else if (request.action == 'reset') {
          tabInfo[request.tabId].endTime = null
          tabInfo[request.tabId].paused = true
          tabInfo[request.tabId].restMs = tabInfo[request.tabId].totalMs
        } else if (request.action == 'done') {
          tabInfo[request.tabId].endTime = null
          tabInfo[request.tabId].paused = true
          tabInfo[request.tabId].finished = true
          tabInfo[request.tabId].restMs = tabInfo[request.tabId].totalMs
          // store the finished reading record
          // {date: {time_stamp: {title: web_title, finished_in: milliseconds}}}
          // not sure whether to store the URL here, it might take too many storage
          _assign(cache, {title: tabInfo[request.tabId].title, finished_in: tabInfo[request.tabId].totalMs - request.restMs}, fomattedDate(), currentTs())
          chrome.storage.sync.set({'history': cache}, () => {})
        }
        sendResponse({message: 'success'})
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
