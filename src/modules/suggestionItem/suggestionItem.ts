import html from './suggestionItem.tpl.html';
import { ViewTemplate } from '../../utils/viewTemplate';
import { View } from '../../utils/view';

export class SuggestionItem {
  text: string;
  view: View;

  constructor(text: string) {
    this.text = text;
    this.view = new ViewTemplate(html).cloneView();
  }

  attach($root: HTMLElement) {
    $root.appendChild(this.view.root);
  }

  render() {
    this.view.title.innerText = this.text;
  }
}
