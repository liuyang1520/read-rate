'use strict';

(function() {
  class Timer {
    constructor(options) {
      this.el = options.el
      this.initialize()
      if (options.estimate) {
        this.setTimer(options.estimate)
      }
      this.updateTimer()
    }

    initialize() {
      this.hours = this.el.querySelector('.hours')
      this.minutes = this.el.querySelector('.minutes')
      this.seconds = this.el.querySelector('.seconds')
    }

    setTimer(estimate) {
      for (let value of ['hours', 'minutes', 'seconds']) {
        this[value].textContent = ('0' + estimate[value]).slice(-2)
      }
    }

    updateTimer() {
      let hours = this.hours.textContent
      let minutes = this.minutes.textContent
      let seconds = this.seconds.textContent
      let diff = hours * 3600 + minutes * 60 + seconds * 1
      let endTime = new Date(new Date().getTime() + diff * 1000)

      let updateHelper = () => {
        let currentDiff = Date.parse(endTime) - Date.parse(new Date())
        if (currentDiff <= 0) {
          clearInterval(updateTimerInterval);
        }
        this.hours.textContent = ('0' + Math.floor((currentDiff / (1000 * 60 * 60)) % 24)).slice(-2)
        this.minutes.textContent = ('0' + Math.floor((currentDiff / 1000 / 60) % 60)).slice(-2)
        this.seconds.textContent = ('0' + Math.floor((currentDiff / 1000) % 60)).slice(-2)
      }

      let updateTimerInterval = setInterval(updateHelper, 1000);
    }
  }

  chrome.runtime.sendMessage({type: 'get_estimate'}, (response) => {
    if (response == null) return;
    if (response.estimate != null) {
      let timer = new Timer({
        el: document.getElementById('timer'),
        estimate: response.estimate
      })
    }
  })
})();
