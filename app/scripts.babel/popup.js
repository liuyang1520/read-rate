'use strict';

(function() {
  class Timer {
    constructor(options) {
      this.$el = $(options.el)
      this.initialize()
      this.setTimer(options.state)
      this._initState = {totalMs: options.state.totalMs, paused: true}
      this.updateTimer()
      this.setEvents()
      if (options.state.paused)
        clearInterval(this._updateTimerInterval)
    }

    initialize() {
      this.$hours = this.$el.find('.hours').first()
      this.$minutes = this.$el.find('.minutes').first()
      this.$seconds = this.$el.find('.seconds').first()
    }

    setTimer(state) {
      if (!state) return
      if (state.paused == true) {
        this.$el.find('#pause-resume').attr('class', 'icon-play')
      } else {
        this.$el.find('#pause-resume').attr('class', 'icon-pause')
      }
      let estimate = {hours: '00', minutes: '00', seconds: '00'}
      if (state.endTime != null) {
        // close and reopen popup
        estimate = periodToTime(endTimeToPeriod(state.endTime), 'string')
      } else if (state.restMs != null) {
        // pause and resume popup
        estimate = periodToTime(state.restMs, 'string')
      } else if (state.totalMs != null) {
        // reset
        estimate = periodToTime(state.totalMs, 'string')
      }
      for (let value of ['hours', 'minutes', 'seconds']) {
        this[`$${value}`].text(estimate[value])
      }
    }

    updateTimer() {
      let endTime = getEndTime(this.getRestTime())
      let updateHelper = () => {
        let currentDiff = endTimeToPeriod(endTime)
        if (currentDiff <= 0) {
          clearInterval(this._updateTimerInterval);
        }
        let timeObject = periodToTime(currentDiff, 'string')
        this.$hours.text(timeObject.hours)
        this.$minutes.text(timeObject.minutes)
        this.$seconds.text(timeObject.seconds)
      }
      this._updateTimerInterval = setInterval(updateHelper, 1000);
    }

    reset() {
      // recalculate the end time for the timer via the duration
      this.setTimer(this._initState)
      //this.updateTimer()
      clearInterval(this._updateTimerInterval)
      syncTime('reset', this.getRestTime())
    }

    pause() {
      clearInterval(this._updateTimerInterval)
      syncTime('pause', this.getRestTime())
    }

    resume() {
      this.updateTimer()
      syncTime('resume', this.getRestTime())
    }

    done() {
      clearInterval(this._updateTimerInterval)
      syncTime('done', this.getRestTime())
      this.setTimer(this._initState)
    }

    getRestTime() {
      let hours = this.$hours.text()
      let minutes = this.$minutes.text()
      let seconds = this.$seconds.text()
      let diff = (hours * 3600 + minutes * 60 + seconds * 1) * 1000
      return diff
    }

    setEvents() {
      this.$el.find('#reset').click((event) => {
        this.reset()
      })

      this.$el.find('#pause-resume').click((event) => {
        let $target = $(event.target)
        if ($target.hasClass('icon-pause')) {
          this.pause()
          $target.addClass('icon-play').removeClass('icon-pause')
        } else if ($target.hasClass('icon-play')) {
          this.resume()
          $target.addClass('icon-pause').removeClass('icon-play')
        }
      })

      this.$el.find('#done').click((event) => {
        this.done()
      })
    }
  }

  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.runtime.sendMessage({type: 'get_estimate', tabId: tabs[0].id}, (response) => {
      if (response == null) return;
      if (response.state != null) {
        new Timer({
          el: document.getElementById('timer'),
          state: response.state
        })
      }
    })
  })

  function syncTime(action, restMs) {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.runtime.sendMessage({type: 'sync_time', action: action, tabId: tabs[0].id, restMs: restMs}, (response) => {
        if (response == null) return;
        if (response.message == null) {
          console.log('Error syncing the time')
        }
      })
    })
  }
})();
