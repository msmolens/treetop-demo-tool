# Treetop Demo Tool

Browser extension to simplify creating up-to-date screenshots of the
[Treetop](https://github.com/msmolens/treetop) Firefox extension.

## Requirements

- [Node.js](https://nodejs.org/) 16.x or greater
- [web-ext](https://github.com/mozilla/web-ext) command line tool for web extensions
- Firefox browser

## Usage

Install dependencies:

```sh
npm install
```

In the `src` directory, use `web-ext` to launch Firefox and load the extension
in a dedicated profile:

```sh
web-ext run -p PROFILE
```

Ensure that the Treetop extension is installed in the profile. Click the Treetop
Demo Tool toolbar button to see the available commands.

## Commands

### Add demo bookmarks

Load the demo bookmarks and add them to the browser. Existing bookmarks in
"Bookmarks Toolbar", "Bookmarks Menu", and "Other Bookmarks" will be deleted.

### Open window

Open Treetop in a new window. Screenshot taken with the "Capture window" command
will target this window.

### Capture window

Download a screenshot of the Treetop window. Prompts for a filename suffix. When
the user enters a suffix the downloaded filename is `treetop-SUFFIX.png`. If the
suffix is empty then the filename is `treetop.png`.
