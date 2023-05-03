const statusDiv = document.getElementById("status");
const btn = document.getElementById("btn");
async function getStatus() {
  try {
    const status = await fetch("http://localhost:3434/ping");
    const msg = await status.json();
    if (msg.pong === "okay") {
      statusDiv.innerHTML = "Status: HBR is running";
      btn.disabled = false;
    }
  } catch {
    statusDiv.innerHTML = "Status: HBR is not running!";
    btn.disabled = true;
  }
}
getStatus();

chrome.runtime.onMessage.addListener((msg) => {
  console.log("popup received msg:", msg);
});

btn.addEventListener("click", async () => {
  const tab = await getCurrentTab();
  chrome.runtime.sendMessage({
    action: "saveWebsite",
    tabId: tab.id,
    title: tab.title,
    url: tab.url,
    favicon: tab.favIconUrl,
  });
});

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
