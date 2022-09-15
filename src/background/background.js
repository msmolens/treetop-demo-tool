/**
 * @typedef { import("../types").CaptureWindowInfo} CaptureWindowInfo
 * @typedef { import("../types").OpenWindowInfo} OpenWindowInfo
 */

import { dataURLtoBlob } from "../data-url-to-blob.js";
import { handleError } from "../error-handler.js";

/** Window ID of last created window */
let windowId = null;

/** Download item ID of in-progress download */
let downloadItemId = null;

/** Blob URL of in-progress download  */
let blobUrl = null;

// Install event listeners
browser.runtime.onMessage.addListener(handleMessage);
browser.downloads.onChanged.addListener(handleDownloadChanged);

//
// Event listeners
//

function handleMessage(request, sender, sendResponse) {
  handleMessageAsync(request, sender, sendResponse).catch(handleError);
}

function handleDownloadChanged(delta) {
  if (delta.state?.current === "complete" && delta.id === downloadItemId) {
    URL.revokeObjectURL(blobUrl);

    blobUrl = null;
    downloadItemId = null;
  }
}

async function handleMessageAsync(request, _sender, _sendResponse) {
  const { id, data } = request;

  if (id === "openWindow") {
    await openWindow(data);
  } else if (id === "captureWindow") {
    await captureWindow(data);
  }
}

/**
 * Create a new browser window with the specified properties.
 *
 * @param {OpenWindowInfo} openWindowInfo
 */
async function openWindow(openWindowInfo) {
  const { url, width, height } = openWindowInfo;

  const window = await browser.windows.create({
    width,
    height,
    type: "panel",
    url,
  });

  windowId = window.id;
}

/**
 * Download a screenshot of the last opened window.
 *
 * @param {CaptureWindowInfo} captureWindowInfo
 */
async function captureWindow(captureWindowInfo) {
  if (windowId === null) {
    throw new Error("Invalid window ID");
  }

  const { filename, width, height, delayMs } = captureWindowInfo;

  // Wait for the specified number of milliseconds
  if (delayMs) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  const dataUrl = await browser.tabs.captureVisibleTab(windowId, {
    format: "png",
    rect: {
      x: 0,
      y: 0,
      width,
      height,
    },
  });

  // browser.downloads.download() cannot download data URLs.
  // See https://bugzilla.mozilla.org/show_bug.cgi?id=1696174.
  //
  // Work around by converting data URL to a blob and creating a URL
  // representing the blob. Note that the URL created by URL.createObjectURL()
  // must be cleaned by calling URL.revokeObjectURL() after the download
  // completes.
  const blob = dataURLtoBlob(dataUrl);
  blobUrl = URL.createObjectURL(blob, { type: "image/png" });

  downloadItemId = await browser.downloads.download({
    filename,
    url: blobUrl,
  });
}
