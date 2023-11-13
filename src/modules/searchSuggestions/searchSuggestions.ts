import { Component } from '../component';
import html from './searchSuggestions.tpl.html';
import { SuggestionItem } from '../suggestionItem/suggestionItem';
import { addElement } from '../../utils/helpers';

class SearchSuggestions extends Component {
  addSplitter(text: string) {
    const el = addElement(this.view.root, 'span', { className: 'searchSuggestions__text' });
    el.innerText = text;
  }

  getSuggestions() {
    // Получение данных с сервера
    return [
      'чехол iphone 13 pro',
      'коляски agex',
      'яндекс станция 2'
    ];
  }

  render() {
    this.view.root.innerHTML = '';

    const suggestions = this.getSuggestions();

    if (suggestions.length !== 0) {
      this.addSplitter('Например');
    }

    suggestions.forEach((suggestion: string, idx ) => {
      if (idx !== suggestions.length - 1 || suggestions.length === 1) {
        this.addSplitter(',' + String.fromCharCode(160));
      } else {
        this.addSplitter(String.fromCharCode(160) + 'или' + String.fromCharCode(160));
      }

      const suggestionComp = new SuggestionItem(suggestion);
      suggestionComp.render();
      suggestionComp.attach(this.view.root);
    });
  }
}

export const searchSuggestionsComp = new SearchSuggestions(html);
