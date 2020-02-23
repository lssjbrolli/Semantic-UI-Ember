import Component from "@glimmer/component";
import hljs from "highlightjs";

export default class extends Component {
  language = this.args.type || this.args.snippet.language;

  highlight(e, [snippet, language, code]) {
    let lang = language ? language : snippet.language;
    if (code) {
      code(snippet.source);
    }
    let codeHighlight = hljs.highlight(lang, snippet.source);

    e.innerHTML = codeHighlight.value;
  }
}
