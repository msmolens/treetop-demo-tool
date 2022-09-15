// Convert data URL to blob.
// Based on https://stackoverflow.com/questions/23150333/html5-javascript-dataurl-to-blob-blob-to-dataurl
export function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);

  let n = bstr.length;
  const data = new Uint8Array(n);

  while (n--) {
    data[n] = bstr.charCodeAt(n);
  }

  return new Blob([data], { type: mime });
}
