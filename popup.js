let clicking = false;

// Func listner: Start Action
document.getElementById("start").addEventListener("click", async () => {
  // Get input1 values
  const x = parseInt(document.getElementById("x").value);
  const y = parseInt(document.getElementById("y").value);
  const interval = parseInt(document.getElementById("interval").value);

  // Get input2 values
  const x2 = parseInt(document.getElementById("x2").value);
  const y2 = parseInt(document.getElementById("y2").value);
  const interval2 = parseInt(document.getElementById("interval2").value);

  clicking = true;

  // Get the active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Scripting API : Start clicking the active tab
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: startClicking,
    args: [x, y, interval, x2, y2, interval2]
  });
});


// Func listner: Stop Action
document.getElementById("stop").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Scripting API : Stop clicking the active tab
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: stopClicking
  });
});

// Button listner: Start Button
function startClicking(x, y, interval, x2, y2, interval2) {
  if (window.autoClickInterval) return;

  window.autoClickInterval = setInterval(async () => {
    const el = document.elementFromPoint(x, y);
    if (el) {
      el.click();
    }

    await new Promise(resolve => setTimeout(resolve, interval)); // Wait for the first click interval

    const el2 = document.elementFromPoint(x2, y2);
    if (el2) {
      el2.click();
    }

  }, interval2);
}

// Button listner: Stop Button
function stopClicking() {
  clearInterval(window.autoClickInterval);
  window.autoClickInterval = null;
}