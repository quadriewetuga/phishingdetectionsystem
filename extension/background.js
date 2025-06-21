console.log("✅ Background service worker loaded");

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log("🌀 Tab update detected:", tab.url, changeInfo);

  if (changeInfo.status === "complete" && tab.url && tab.url.startsWith("http")) {
    const url = tab.url;
    const username = "eniola";

    console.log("📡 Sending URL to API:", url);

    fetch("http://172.20.10.2:8000/scan_and_save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url, username })
    })
      .then(async res => {
        if (!res.ok) {
          const text = await res.text(); // Try to read the error response
          throw new Error(`Server error: ${res.status} - ${text}`);
        }
        return res.json(); // Parse if it's valid JSON
      })
      .then(data => {
        if (data.label !== undefined) {
          const isPhishing = data.label === 1;
          const message = isPhishing ? "⚠️ Phishing Site!" : "✅ Safe Site";

          chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
              type: "SHOW_RESULT",
              label: message,
              confidence: data.confidence
            });
          });
        } else {
          console.error("⚠️ Unexpected API response:", data);
        }
      })
      .catch(error => {
        console.error("❌ Error calling API:", error.message);
      });
  }
});
