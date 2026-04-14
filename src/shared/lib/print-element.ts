export function printElement(element: HTMLElement, title = document.title) {
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((node) => node.outerHTML)
    .join("\n");

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.setAttribute("aria-hidden", "true");
  document.body.appendChild(iframe);

  const frameDoc = iframe.contentDocument;
  const frameWin = iframe.contentWindow;
  if (!frameDoc || !frameWin) {
    iframe.remove();
    return false;
  }

  frameDoc.open();
  frameDoc.write(`
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    ${styles}
    <style>
      body { margin: 0; padding: 16px; background: #fff; }
      @page { margin: 12mm; }
    </style>
  </head>
  <body></body>
</html>
  `);
  frameDoc.close();

  const clone = element.cloneNode(true) as HTMLElement;
  frameDoc.body.appendChild(clone);

  frameWin.focus();
  frameWin.print();
  setTimeout(() => iframe.remove(), 500);
  return true;
}
