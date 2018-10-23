'use strict';

(function() {
  class Timer {
    constructor(options) {
      this.el = options.el
      this.initialize()
      if (options.state) {
        this.setTimer(options.state)
      }
      this.updateTimer()
    }

    initialize() {
      this.hours = this.el.querySelector('.hours')
      this.minutes = this.el.querySelector('.minutes')
      this.seconds = this.el.querySelector('.seconds')
    }

    setTimer(state) {
      let estimate = periodToTime(endTimeToPeriod(state.endTime), 'string')
      for (let value of ['hours', 'minutes', 'seconds']) {
        this[value].textContent = estimate[value]
      }
    }

    updateTimer() {
      let hours = this.hours.textContent
      let minutes = this.minutes.textContent
      let seconds = this.seconds.textContent
      let diff = (hours * 3600 + minutes * 60 + seconds * 1) * 1000
      let endTime = getEndTime(diff)

      let updateHelper = () => {
        let currentDiff = endTimeToPeriod(endTime)
        if (currentDiff <= 0) {
          clearInterval(updateTimerInterval);
        }
        let timeObject = periodToTime(currentDiff, 'string')
        this.hours.textContent = timeObject.hours
        this.minutes.textContent = timeObject.minutes
        this.seconds.textContent = timeObject.seconds
      }

      let updateTimerInterval = setInterval(updateHelper, 1000);
    }
  }

  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.runtime.sendMessage({type: 'get_estimate', tabId: tabs[0].id}, (response) => {
      if (response == null) return;
      if (response.state != null) {
        let timer = new Timer({
          el: document.getElementById('timer'),
          state: response.state
        })
      }
    })
  })
})();
