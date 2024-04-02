// @ts-ignore
import mhtml2html from "../../assets/deps/mhtml2html";

export async function prepareMhtml(mhtmlPath: string) {
  const mhtml = await window.electron.readFile(mhtmlPath);
  let htmlDoc = mhtml2html.convert(mhtml);
  htmlDoc.window.document
    .querySelectorAll("a")
    .forEach((aTag: HTMLAnchorElement) => {
      aTag.setAttribute("target", "_blank");
    });
  const html = new XMLSerializer().serializeToString(htmlDoc.window.document);
  return html;
}
