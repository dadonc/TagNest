console.log("This is a background script.");

function inlineStylesheets2() {
  // inline all stylesheets, including injected from uBlock Origin
  var styleSheets = document.styleSheets;
  var cssText = "";
  for (var i = 0; i < styleSheets.length; i++) {
    console.log("Inlining stylesheet: " + styleSheets[i].href);
    var styleSheet = styleSheets[i];
    try {
      var cssRules = styleSheet.cssRules;
      for (var j = 0; j < cssRules.length; j++) {
        cssText += cssRules[j].cssText;
      }
    } catch (e) {
      console.log("Error inlining stylesheet: " + styleSheet.href + ": " + e);
    }
  }
  var style = document.createElement("style");
  style.innerHTML = cssText;
  console.log(cssText);
  document.head.appendChild(style);
}

function inlineStylesheets() {
  var cssText = "";
  var elements = [document.documentElement];

  while (elements.length > 0) {
    var element = elements.pop();
    var rules = window.getMatchedCSSRules(element);
    if (rules) {
      for (var i = 0; i < rules.length; i++) {
        cssText += rules[i].cssText + "\n";
      }
    }
    for (var i = 0; i < element.children.length; i++) {
      elements.push(element.children[i]);
    }
  }
  var style = document.createElement("style");
  style.type = "text/css";
  style.innerHTML = cssText;
  document.head.appendChild(style);
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "saveWebsite") {
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
  } else {
    console.log("BGScript", msg);
    return false;
  }
});
