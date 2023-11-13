import { Component } from '../component';
import html from './favorites.tpl.html';
import { favoritesService } from '../../services/favorites.service';

import { ProductList } from '../productList/productList';

class Favorites extends Component {
  productList: ProductList;

  constructor(props: any) {
    super(props);

    this.productList = new ProductList();
    this.productList.attach(this.view.favorites);
  }

  async render() {
    const products = await favoritesService.getFavorites();

    if (products.length < 1) {
      return;
    }
    this.productList.update(products);
  }
}

export const favoritesComp = new Favorites(html);
