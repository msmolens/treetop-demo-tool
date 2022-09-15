/**
 * @typedef { import("./types").DemoBookmark } DemoBookmark
 * @typedef { import("./types").DemoBookmarks } DemoBookmarks
 */

// Number of milliseconds in an hour
const MILLISECONDS_PER_HOUR =
  1000 * // ms per second
  60 * // seconds per minute
  60; // minutes per hour

// Number of milliseconds in a day
const MILLISECONDS_PER_DAY = 24 * MILLISECONDS_PER_HOUR;

/**
 * Class to set up a browser demo screenshots of the Treetop Firefox extension.
 * This includes the following tasks:
 *
 * - Removing existing bookmarks
 * - Adding demo bookmarks
 * - Adding demo history visits
 *
 */
export class DemoBookmarkManager {
  constructor(demoBookmarks) {
    /** @type {DemoBookmarks} */
    this.demoBookmarks = demoBookmarks;

    /** @type {Date} */
    this.now = new Date();
  }

  async run() {
    await this.#validateRootFolders();
    await this.#removeExistingBookmarks();
    await this.#addDemoBookmarks();
  }

  /**
   * Verify that the root folders specified in the list of demo bookmarks exist.
   */
  async #validateRootFolders() {
    for (const rootId of Object.keys(this.demoBookmarks)) {
      await browser.bookmarks.get(rootId);
    }
  }

  /**
   * Recursively remove exist bookmarks under the root folders.
   */
  async #removeExistingBookmarks() {
    for (const rootId of Object.keys(this.demoBookmarks)) {
      const children = await browser.bookmarks.getChildren(rootId);
      for (const child of children) {
        await browser.bookmarks.removeTree(child.id);
      }
    }
  }

  /**
   * Add demo bookmarks to the browser.
   */
  async #addDemoBookmarks() {
    for (const [rootId, bookmarks] of Object.entries(this.demoBookmarks)) {
      for (const bookmark of bookmarks) {
        await this.#addBookmark(rootId, bookmark);
      }
    }
  }

  /**
   * Recursively add a folder or bookmark under the specified parent.
   *
   * @param {string} parentId
   * @param {DemoBookmark} bookmark
   */
  async #addBookmark(parentId, bookmark) {
    const { title, url, lastVisitTimeDays, children } = bookmark;

    if (children !== undefined) {
      // Create folder
      const folder = await browser.bookmarks.create({ parentId, title });
      parentId = folder.id;

      // Add children recursively
      for (const bookmark of children) {
        await this.#addBookmark(parentId, bookmark);
      }
    } else {
      // Add bookmark
      await browser.bookmarks.create({ parentId, title, url });

      // Set last visit time
      if (lastVisitTimeDays !== undefined) {
        const offset = MILLISECONDS_PER_HOUR;
        const visitTime =
          this.now - lastVisitTimeDays * MILLISECONDS_PER_DAY + offset;
        await browser.history.addUrl({ url, visitTime });
      }
    }
  }
}
