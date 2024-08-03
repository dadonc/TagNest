chrome.runtime.onStartup.addListener(() => {
  checkServerStatusAndUpdateIcon();
});

chrome.runtime.onInstalled.addListener(() => {
  checkServerStatusAndUpdateIcon();
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "pageLoaded") {
    checkServerStatusAndUpdateIcon();
    sendResponse({ status: "ok" });
  }
});

chrome.action.onClicked.addListener(iconClickLogic);

async function checkConnection() {
  try {
    const response = await fetch("http://localhost:3434/ping");
    const data = await response.json();
    return !!data && data.pong === "okay";
  } catch (error) {
    return false;
  }
}

async function checkServerStatusAndUpdateIcon() {
  if (await checkConnection()) {
    chrome.action.setIcon({ path: "../icons/nest_128.png" });
    return true;
  } else {
    chrome.action.setIcon({ path: "../icons/nest_bw_128.png" });
    return false;
  }
}

async function iconClickLogic() {
  const isConnectionOk = await checkServerStatusAndUpdateIcon();
  if (isConnectionOk) {
    saveWebsite();
  } else {
    openNoConnectionPopup();
  }
}

async function openNoConnectionPopup() {
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
}

async function saveWebsite() {
  const tab = await getCurrentTab();

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: inlineStylesheets,
    },
    (results) => {
      if (results[0].result !== "complete") {
        console.log("Page is not fully loaded yet.");
        return;
      }
      chrome.pageCapture.saveAsMHTML({ tabId: tab.id }, async (mhtml) => {
        const formData = new FormData();
        formData.append("title", tab.title);
        formData.append("url", tab.url);
        // TODO handle inline favicons, currently only works for external favicons
        // e.g. https://www.prisma.io/docs/orm/prisma-migrate/workflows/patching-and-hotfixing#failed-migration doesn't work
        if (tab.favIconUrl && tab.favIconUrl.length < 100) {
          formData.append("favicon", tab.favIconUrl);
        } else {
          formData.append("favicon", "");
        }
        formData.append("mhtml", mhtml);
        chrome.tabs.captureVisibleTab(null, null, async (screenshotData) => {
          formData.append("screenshot", screenshotData);
          try {
            const response = await fetch("http://localhost:3434/mhtml", {
              method: "POST",
              body: formData,
            });

            const result = await response.json();
            if (!result.success) {
              openNoConnectionPopup();
            }
          } catch (error) {
            console.log(error);
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

const inlineStylesheets = () => {
  // todo: inline dynamically added stylesheets
  // see https://www.science.org/content/article/brazilian-frog-might-be-first-pollinating-amphibian-known-science for example
  return document.readyState;
};
