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
        console.error("Error sending message:",chrome.runtime.lastError.message,);
        return;
      }

      // Safe access to response properties to keep undefined values without throwing an error
      x = response?.x;
      y = response?.y;

      if (x === undefined || y === undefined) return; //Guard clause: If either is undefined, do not proceed

      if (e.altKey && e.key === "1") {
        document.getElementById("x").value = x;
        document.getElementById("y").value = y;
      } else if (e.altKey && e.key === "2") {
        document.getElementById("x2").value = x;
        document.getElementById("y2").value = y;
      }

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

// document.addEventListener("mousemove", e => {
//   mouseX = e.clientX;
//   mouseY = e.clientY;
// });

// chrome.scripting.executeScript({
//   target: { tabId: tab.id },
//   func: e => {
//     mouseX = e.clientX;
//     mouseY = e.clientY;
//   }
// });

// document.addEventListener("keydown", async e => {
//   const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     func: e => {
//       mouseX = e.clientX;
//       mouseY = e.clientY;
//     }
//   });
  
//   console.log(e.key);
//   document.getElementById("x").value = mouseX;
//   document.getElementById("y").value = mouseY;
// });

//========================================================================================================

// Button listner: Start Button
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


// Button listner: Stop Button
document.getElementById("stop").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Scripting API : Stop clicking the active tab
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: stopClicking
  });
});

// Func : Start Action
function startClicking(x, y, interval, x2, y2, interval2) {
  if (window.autoClickInterval) return;
  window.isClicking = true;

  // window.autoClickInterval = setInterval(async () => {
  //   const el = document.elementFromPoint(x, y);
  //   if (el) {
  //     el.click();
  //   }

  //   await new Promise(resolve => setTimeout(resolve, interval)); // Wait for the first click interval

  //   const el2 = document.elementFromPoint(x2, y2);
  //   if (el2) {
  //     el2.click();
  //   }

  // }, interval2);

  async function clickLoop() {
    while (window.isClicking) {
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

// Func : Stop Action
function stopClicking() {
  clearInterval(window.autoClickInterval);
  window.isClicking = false;
}