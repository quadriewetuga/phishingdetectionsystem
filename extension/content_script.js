chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SHOW_RESULT") {
    const banner = document.createElement("div");
    banner.style.position = "fixed";
    banner.style.top = "0";
    banner.style.left = "0";
    banner.style.right = "0";
    banner.style.padding = "10px";
    banner.style.zIndex = "9999";
    banner.style.fontWeight = "bold";
    banner.style.textAlign = "center";
    banner.style.color = "white";
    banner.style.backgroundColor = message.label.includes("Phishing") ? "red" : "green";
    banner.innerText = `${message.label} | Confidence: ${message.confidence}%`;
    document.body.prepend(banner);
  }
});
