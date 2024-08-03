function onPageLoad() {
  chrome.runtime.sendMessage({ action: "pageLoaded" }, function (response) {});
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", onPageLoad);
} else {
  onPageLoad();
}
