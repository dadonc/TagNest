console.log("This is a background script.");

chrome.runtime.onMessage.addListener(async (msg) => {
  if (msg.action === "saveWebsite") {
    console.log("BGScript - action - saveWebsite");
    chrome.runtime.sendMessage({ status: "okay" });
  } else {
    console.log("BGScript", msg);
  }
});
