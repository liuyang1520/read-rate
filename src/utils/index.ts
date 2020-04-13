function periodToTime(period: number) {
  // period is the time in milliseconds
  if (period <= 0) {
    period = 0
  }
  let hours: string = Math.floor((period / (1000 * 60 * 60)) % 24).toString();
  let minutes: string = Math.floor((period / 1000 / 60) % 60).toString();
  let seconds: string = Math.floor((period / 1000) % 60).toString();
  hours = ('0' + hours).slice(-2)
  minutes = ('0' + minutes).slice(-2)
  seconds = ('0' + seconds).slice(-2)
  return {
    hours: hours,
    minutes: minutes,
    seconds: seconds
  }
}

function getEndTime(period, now = new Date()) {
  // period is the time in milliseconds
  return now.getTime() + period
}

function endTimeToPeriod(endTime, now = new Date()) {
  return endTime - Date.parse(now.toString())
}

function _pick(object, ...properties) {
  return Object.assign({}, ...properties.map(property => ({[property]: object[property]})));
}
