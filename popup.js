let clicking = false;

document.getElementById("start").addEventListener("click", async () => {
  const x = parseInt(document.getElementById("x").value);
  const y = parseInt(document.getElementById("y").value);
  const interval = parseInt(document.getElementById("interval").value);

  clicking = true;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: startClicking,
    args: [x, y, interval]
  });
});

document.getElementById("stop").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: stopClicking
  });
});

function startClicking(x, y, interval) {
  if (window.autoClickInterval) return;

  window.autoClickInterval = setInterval(() => {
    const el = document.elementFromPoint(x, y);
    if (el) {
      el.click();
    }
  }, interval);
}

function stopClicking() {
  clearInterval(window.autoClickInterval);
  window.autoClickInterval = null;
}