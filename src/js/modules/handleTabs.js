import handleStorage from './handleStorage'

var background = chrome.extension.getBackgroundPage();
const brwlock = window.brwlock = {}

function closeAllTabs() {
  console.log("closeAllTab()");

  var lockPageTabId;

  // pattern lock page open
  chrome.tabs.create({ "url": "/html/options.html" }, function (tab) {
    console.log("lock page tab create");
    lockPageTabId = tab.id;
  });

  // close all tab (save tab url)
  chrome.tabs.getAllInWindow(function (tabs) {
    var pastUrls = new Array();

    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].id != lockPageTabId) {
        chrome.tabs.remove(tabs[i].id, function () { });
        pastUrls.push(tabs[i].url);
      }
    }

    var saveUrlFormat = "{";
    for (var i = 0; i < pastUrls.length; i++) {
      saveUrlFormat += pastUrls[i] + ";"
    }
    saveUrlFormat += "}";
    handleStorage.save('brwlock-pastUrls', saveUrlFormat);
  });
}

function openAllPastUrls() {
  handleStorage.get('brwlock-pastUrls', getPastUrlSuccessCallback);
}

function getPastUrlSuccessCallback(urls) {
  urls = urls.replace('{', '');
  urls = urls.replace('}', '');
  let pastUrls = urls.split(';');

  for (var i = 0; i < pastUrls.length; i++) {
    if (pastUrls[i].length > 0) {
      chrome.tabs.create({ "url": pastUrls[i] });
    }
  }
}

export default {
  openAllPastUrls,
  closeAllTabs
}