(function () {
  // Create the overlay div
  const overlay = document.createElement("div");
  overlay.setAttribute("id", "custom-extension-overlay");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  overlay.style.zIndex = "10000";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.color = "white";
  overlay.style.fontSize = "24px";
  overlay.style.fontFamily = "Arial, sans-serif";

  const iconUrl = chrome.runtime.getURL("icons/nest_512.png");
  const imgElement = document.createElement("img");
  imgElement.src = iconUrl;
  imgElement.style.width = "100px";
  imgElement.style.height = "100px";
  overlay.appendChild(imgElement);

  // Create the text to display in the overlay
  const errorMessage = document.createElement("div");
  errorMessage.textContent = "Please start TagNest to save this website.";

  // Append the error message to the overlay
  overlay.appendChild(errorMessage);

  // Append the overlay to the body
  document.body.appendChild(overlay);

  // Remove the overlay when clicked
  overlay.addEventListener("click", function () {
    overlay.remove();
  });
})();
