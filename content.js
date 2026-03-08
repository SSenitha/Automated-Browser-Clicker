console.log("content script loaded");

// store latest mouse position
let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// // listen for keypresses anywhere
// document.addEventListener("keydown", e => {
//   // send message to the extension popup (or background)

//   console.log("Key pressed: " + e.key);
//   chrome.runtime.sendMessage({
//     key: e.key,
//     x: mouseX,
//     y: mouseY
//   });
// });

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "getMousePosition") {
    // send mouse coordinates back to popup
    sendResponse({ x: mouseX, y: mouseY });
    return true; // keeps the message channel open if response is async
  }
});