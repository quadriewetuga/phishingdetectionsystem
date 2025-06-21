chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SHOW_RESULT") {
    const existing = document.getElementById("phishing-popup");
    if (existing) existing.remove(); // Prevent multiple popups

    const popup = document.createElement("div");
    popup.id = "phishing-popup";
    popup.style.position = "fixed";
    popup.style.bottom = "20px";
    popup.style.right = "20px";
    popup.style.padding = "16px";
    popup.style.backgroundColor = message.label.includes("Phishing") ? "#d32f2f" : "#388e3c";
    popup.style.color = "white";
    popup.style.borderRadius = "10px";
    popup.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
    popup.style.zIndex = "99999";
    popup.style.maxWidth = "300px";
    popup.style.fontFamily = "Arial, sans-serif";

    const text = document.createElement("p");
    text.innerText = `${message.label} | Confidence: ${message.confidence}%`;

    const btnContainer = document.createElement("div");
    btnContainer.style.marginTop = "10px";
    btnContainer.style.display = "flex";
    btnContainer.style.justifyContent = "space-between";

    const viewBtn = document.createElement("button");
    viewBtn.innerText = "View Full Report";
    viewBtn.style.background = "white";
    viewBtn.style.color = popup.style.backgroundColor;
    viewBtn.style.border = "none";
    viewBtn.style.padding = "6px 10px";
    viewBtn.style.cursor = "pointer";
    viewBtn.style.borderRadius = "5px";
    viewBtn.onclick = () => {
      const username = "eniola";
      const streamlitURL = "https://phishingdetectionsystem.streamlit.app/";
      const currentURL = encodeURIComponent(window.location.href);

      window.open(`${streamlitURL}/?url=${currentURL}&username=${username}`, "_blank");
    };

    const closeBtn = document.createElement("button");
    closeBtn.innerText = "❌";
    closeBtn.style.background = "transparent";
    closeBtn.style.color = "white";
    closeBtn.style.border = "none";
    closeBtn.style.fontSize = "16px";
    closeBtn.style.cursor = "pointer";
    closeBtn.onclick = () => {
      popup.remove();
    };

    btnContainer.appendChild(viewBtn);
    btnContainer.appendChild(closeBtn);
    popup.appendChild(text);
    popup.appendChild(btnContainer);
    document.body.appendChild(popup);
  }
});
