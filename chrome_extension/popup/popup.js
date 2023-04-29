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
  console.log("popup", msg);
});

document.getElementById("btn").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "saveWebsite" });
});
