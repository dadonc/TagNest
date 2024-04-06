console.log("This is a background script.");

const inlineStylesheets = () => {
  // todo: inline dynamically added stylesheets
  // see https://www.science.org/content/article/brazilian-frog-might-be-first-pollinating-amphibian-known-science for example
  return;
};

chrome.runtime.onStartup.addListener(() => {
  checkServerStatusAndUpdateIcon();
});

chrome.runtime.onInstalled.addListener(() => {
  checkServerStatusAndUpdateIcon();
});

async function checkConnection() {
  try {
    const response = await fetch("http://localhost:3434/ping");
    const data = await response.json();
    return data && data.pong === "okay";
  } catch (error) {
    return false;
  }
}

async function checkServerStatusAndUpdateIcon() {
  if (await checkConnection()) {
    chrome.action.setIcon({ path: "../icons/nest_128.png" });
    chrome.action.onClicked.removeListener(openNoConnectionPopup);
    chrome.action.onClicked.addListener(iconClickLogic);
    console.log("connection okay");
    return true;
  } else {
    chrome.action.setIcon({ path: "../icons/nest_bw_128.png" });
    chrome.action.onClicked.removeListener(iconClickLogic);
    chrome.action.onClicked.addListener(openNoConnectionPopup);
    console.log("no connection");
    return false;
  }
}

async function iconClickLogic() {
  if (await checkServerStatusAndUpdateIcon()) {
    console.log("icon clicked: save");
    saveWebsite();
    return true;
  }
  return false;
}

async function openNoConnectionPopup() {
  console.log("no connection popup");
  if (await iconClickLogic()) {
    console.log("iconClickLogic returned true");
    return;
  }
  console.log("iconClickLogic returned false");
  const tab = await getCurrentTab();

  try {
    if (tab.url?.startsWith("chrome://")) return undefined;
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["scripts/error-modal.js"],
    });
  } catch (error) {
    console.log(error);
  }
  console.log("error modal injected");
}

async function saveWebsite() {
  const tab = await getCurrentTab();
  console.log("tab", tab);

  const msg = {
    action: "saveWebsite",
    tabId: tab.id,
    title: tab.title,
    url: tab.url,
    favicon: tab.favIconUrl,
  };
  chrome.scripting.executeScript(
    {
      target: { tabId: msg.tabId },
      function: inlineStylesheets,
    },
    () => {
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
    }
  );
}

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
