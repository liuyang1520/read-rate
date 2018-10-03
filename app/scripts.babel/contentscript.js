'use strict';

(function() {
  let documentClone = document.cloneNode(true)
  let article = new Readability(documentClone).parse()

  chrome.runtime.sendMessage({type: 'set_content', content: article}, (response) => {
  })
})();
