console.log("This is a background script.");

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "saveWebsite") {
    chrome.pageCapture.saveAsMHTML({ tabId: msg.tabId }, async (mhtml) => {
      const formData = new FormData();
      formData.append("title", msg.title);
      formData.append("url", msg.url);
      formData.append("favicon", msg.favicon);
      formData.append("mhtml", mhtml);
      chrome.tabs.captureVisibleTab(null, null, async (screenshotData) => {
        formData.append("screenshot", screenshotData);
        try {
          const response = await fetch("http://localhost:3434/mhtml", {
            method: "POST",
            body: formData,
          });

          const result = await response.json();
          chrome.runtime.sendMessage(result);
        } catch (error) {
          console.error(error);
          chrome.runtime.sendMessage({ success: "false", error });
        }
      });
    });
  } else {
    console.log("BGScript", msg);
    return false;
  }
});
