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

function _assign(object, value, ...properties) {
  let len = properties.length
  for (let i = 0; i < len - 1; i++) {
    let property = properties[i]
    if (!(property in object)) object[property] = {}
    object = object[property]
  }
  object[properties[len-1]] = value
}

function fomattedDate(date = new Date()) {
  let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

function currentTs() {
  return Math.floor(Date.now() / 1000)
}
