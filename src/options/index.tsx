chrome.storage.sync.get(['settings_read_rate'], (result) => {
  if (result.settings_read_rate != null) {
    (document.getElementById('settings-read-rate') as HTMLInputElement).value = result.settings_read_rate;
  }
})

function isInteger(str) {
  let n = Math.floor(Number(str));
  return n !== Infinity && String(n) === str && n >= 0;
}

document.getElementById('settings-save').addEventListener('click', () => {
  let readRate = (document.getElementById('settings-read-rate') as HTMLInputElement).value;
  if (isInteger(readRate)) {
    console.log('trying to save')
    chrome.storage.sync.set({'settings_read_rate': Math.floor(Number(readRate))}, () => {
      document.getElementById('settings-save').textContent = 'Saved';
    })
  }
})
