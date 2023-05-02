const statusDiv = document.getElementById("status");

async function getStatus() {
  try {
    const status = await fetch("http://localhost:3434/ping");
    const msg = await status.json();
    if (msg.pong === "okay") {
      statusDiv.innerHTML = "Status: HBR is running";
    }
  } catch {
    statusDiv.innerHTML = "Status: HBR is not running!";
  }
}
getStatus();

chrome.runtime.onMessage.addListener((msg) => {
  console.log("popup received msg:", msg);
});

document.getElementById("btn").addEventListener("click", async () => {
  const tab = await getCurrentTab();
  chrome.runtime.sendMessage(
    {
      action: "saveWebsite",
      tabId: tab.id,
      title: tab.title,
      url: tab.url,
      favicon: tab.favIconUrl,
    },
    (response) => {
      console.log("popup - action - saveWebsite - response", response);
    }
  );
});

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
