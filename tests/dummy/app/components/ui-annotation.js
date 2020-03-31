import Component from "@glimmer/component";
import { action } from "@ember/object";
import { getCodeSnippet } from "ember-code-snippet";
import hljs from "highlightjs";

export default class extends Component {
  snippet = getCodeSnippet(this.args.snippet);
  language = this.args.lang || this.snippet.language;

  @action
  highlight(e) {
    let codeHighlight = hljs.highlight(this.language, this.snippet.source);

    e.innerHTML = codeHighlight.value;
  }
}
