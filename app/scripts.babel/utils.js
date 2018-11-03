function periodToTime(period, returnType = 'int') {
  // period is the time in milliseconds
  if (period <= 0) {
    period = 0
  }
  let hours = Math.floor((period / (1000 * 60 * 60)) % 24)
  let minutes = Math.floor((period / 1000 / 60) % 60)
  let seconds = Math.floor((period / 1000) % 60)
  if (returnType == 'string') {
    hours = ('0' + hours).slice(-2)
    minutes = ('0' + minutes).slice(-2)
    seconds = ('0' + seconds).slice(-2)
  }
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
  return endTime - Date.parse(now)
}

function _pick(object, ...properties) {
  return Object.assign({}, ...properties.map(property => ({[property]: object[property]})));
}
