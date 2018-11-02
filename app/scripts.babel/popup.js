'use strict';

(function() {
  class Timer {
    constructor(options) {
      this.$el = $(options.el)
      this.initialize()
      if (options.state) {
        this.setTimer(options.state)
      }
      this.updateTimer()
    }

    initialize() {
      this.hours = this.$el.find('.hours').first()
      this.minutes = this.$el.find('.minutes').first()
      this.seconds = this.$el.find('.seconds').first()
    }

    setTimer(state) {
      let estimate = periodToTime(endTimeToPeriod(state.endTime), 'string')
      for (let value of ['hours', 'minutes', 'seconds']) {
        this[value].text(estimate[value])
      }
    }

    updateTimer() {
      let hours = this.hours.text()
      let minutes = this.minutes.text()
      let seconds = this.seconds.text()
      let diff = (hours * 3600 + minutes * 60 + seconds * 1) * 1000
      let endTime = getEndTime(diff)

      let updateHelper = () => {
        let currentDiff = endTimeToPeriod(endTime)
        if (currentDiff <= 0) {
          clearInterval(updateTimerInterval);
        }
        let timeObject = periodToTime(currentDiff, 'string')
        this.hours.text(timeObject.hours)
        this.minutes.text(timeObject.minutes)
        this.seconds.text(timeObject.seconds)
      }

      let updateTimerInterval = setInterval(updateHelper, 1000);
    }

    reset() {
      console.log('reset')
    }

    pause() {
      console.log('pause')
    }

    resume() {
      console.log('resume')
    }
  }

  let timer = null;

  $('#reset').click((event) => {
    timer.reset()
  })

  $('#pause-resume').click((event) => {
    let $target = $(event.target)
    if ($target.hasClass('icon-play')) {
      timer.pause()
      $target.addClass('icon-pause').removeClass('icon-play')
    } else if ($target.hasClass('icon-pause')) {
      timer.resume()
      $target.addClass('icon-play').removeClass('icon-pause')
    }
  })

  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.runtime.sendMessage({type: 'get_estimate', tabId: tabs[0].id}, (response) => {
      if (response == null) return;
      if (response.state != null) {
        timer = new Timer({
          el: document.getElementById('timer'),
          state: response.state
        })
      }
    })
  })
})();
