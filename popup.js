let clicking = false;

document.addEventListener("keydown", async (e) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!(e.altKey && (e.key === "1" || e.key === "2"))) return;
  let x, y;

  chrome.tabs.sendMessage(
    tab.id,
    { action: "getMousePosition" }, // message

    (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:",chrome.runtime.lastError.message);
        return;
      }

      x = response?.x; // Safe access to response properties to keep undefined values without throwing an error
      y = response?.y;

      if (x === undefined || y === undefined) return; //Guard clause: If either is undefined, do not proceed

      if (e.altKey && e.key === "1") {
        document.getElementById("x").textContent = x;
        document.getElementById("y").textContent = y;
      } else if (e.altKey && e.key === "2") {
        document.getElementById("x2").textContent = x;
        document.getElementById("y2").textContent = y;
      }

      //After assigning the coordinates to the elements, a click simulated.
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        // Temporary function to simulate click.
        func: (x, y) => {
          document.elementFromPoint(x, y).click();
        },
        args: [x, y],
      });
    },
  );
});



//------------------_Button listner: Start Button_------------------
document.getElementById("start").addEventListener("click", async () => {
  // Get input1 values
  const x = parseInt(document.getElementById("x").textContent);
  const y = parseInt(document.getElementById("y").textContent);
  const interval = parseInt(document.getElementById("interval").value);

  // Get input2 values
  const x2 = parseInt(document.getElementById("x2").textContent);
  const y2 = parseInt(document.getElementById("y2").textContent);
  const interval2 = parseInt(document.getElementById("interval2").value);

  // Get the active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Scripting API : Start clicking the active tab
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: startClicking,
    args: [x, y, interval, x2, y2, interval2]
  });
});



//-------------------_Button listner: Stop Button_-------------------
document.getElementById("stop").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Scripting API : Stop clicking the active tab
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: stopClicking
  });
});



//-----------------------_Func : Start Action_-----------------------
function startClicking(x, y, interval, x2, y2, interval2) {
  if (window.autoClickInterval) return;
  clicking = true;

  async function clickLoop() {
    while (clicking) {
      const el = document.elementFromPoint(x, y);
      if (el) {
       el.click();
      }

      await new Promise(resolve => setTimeout(resolve, interval)); // Wait for the first click interval

      const el2 = document.elementFromPoint(x2, y2);
      if (el2) {
        el2.click();
      }

      await new Promise(resolve => setTimeout(resolve, interval2)); // Wait for the second click interval before the next loop
    }
  }

  clickLoop();
  
}



//-----------------------_Func : Stop Action_-----------------------
function stopClicking() {
  clearInterval(window.autoClickInterval);
  clicking = false;
}