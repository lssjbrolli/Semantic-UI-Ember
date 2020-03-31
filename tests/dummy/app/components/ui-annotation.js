import Component from "@glimmer/component";
import { action } from "@ember/object";
import hljs from "highlightjs";

export default class extends Component {
  language = this.args.lang || this.args.snippet.language;

  @action
  highlight(e, [snippet]) {
    let codeHighlight = hljs.highlight(this.language, snippet.source);

    e.innerHTML = codeHighlight.value;
  }
}
