import Readability from "readability";

let documentClone = document.cloneNode(true)
let article = new Readability(documentClone).parse()

chrome.runtime.sendMessage({type: 'store_content', content: article}, (response) => {
})
