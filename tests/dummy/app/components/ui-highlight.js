import Component from "@glimmer/component";
import hljs from "highlightjs";

let escapeHtml = html => {
  return (
    html
      // .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
  );
};
export default class extends Component {
  highlight(elem) {
    let data = elem.querySelector("script");
    let escaped = escapeHtml(data.innerHTML);
    elem.innerHTML = escaped;

    // if (copyCode) {
    //   copyCode(data.innerHTML);
    // }

    hljs.highlightBlock(elem);
  }
}
