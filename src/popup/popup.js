import { DemoBookmarkManager } from "../DemoBookmarkManager.js";
import { handleError } from "../error-handler.js";

const TREETOP_URL =
  "moz-extension://e7921fec-5e81-45d4-9645-0d5cae9799b5/treetop.html";
const WINDOW_WIDTH = 1280;
const WINDOW_HEIGHT = 800;
const CAPTURE_WINDOW_DELAY_MS = 3000;

const addDemoBookmarksButton = document.getElementById("addDemoBookmarks");
const openWindowButton = document.getElementById("openWindow");
const captureWindowButton = document.getElementById("captureWindow");
const captureWindowDelayButton = document.getElementById("captureWindowDelay");

addDemoBookmarksButton.addEventListener("click", function () {
  setupDemo().catch(handleError);
});

openWindowButton.addEventListener("click", function () {
  openWindow().catch(handleError);
});

captureWindowButton.addEventListener("click", function () {
  captureWindow().catch(handleError);
});

captureWindowDelayButton.addEventListener("click", function () {
  captureWindow(CAPTURE_WINDOW_DELAY_MS).catch(handleError);
});

/**
 * Load demo bookmarks from a file and parse as JSON.
 */
async function loadDemoBookmarks(filename) {
  const url = browser.runtime.getURL(filename);
  const data = await fetch(url);
  return data.json();
}

/**
 * Load demo bookmarks and add them to the browser.
 */
async function setupDemo() {
  const demoBookmarks = await loadDemoBookmarks("data/demo-bookmarks.json");

  const demoBookmarkManager = new DemoBookmarkManager(demoBookmarks);
  await demoBookmarkManager.run();
}

/**
 * Open Treetop in a new window.
 */
async function openWindow() {
  await browser.runtime.sendMessage({
    id: "openWindow",
    data: {
      url: TREETOP_URL,
      width: WINDOW_WIDTH,
      height: WINDOW_HEIGHT,
    },
  });
}

/**
 * Download a screenshot of the Treetop window.
 * The user may enter a suffix for the filename.
 *
 * @param {number} [delayMs]
 */
async function captureWindow(delayMs) {
  const suffix = prompt("Filename suffix");
  if (suffix === null) {
    return;
  }

  const filename = suffix.length > 0 ? `treetop-${suffix}.png` : "treetop.png";

  await browser.runtime.sendMessage({
    id: "captureWindow",
    data: { filename, width: WINDOW_WIDTH, height: WINDOW_HEIGHT, delayMs },
  });
}
