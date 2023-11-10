import { ViewTemplate } from '../../utils/viewTemplate';
import { View } from '../../utils/view';
import { formatPrice } from '../../utils/helpers'
import html from './product.tpl.html';
import { ProductData } from 'types';
import { statisticsService } from '../../services/statistics.service';

type ProductComponentParams = { [key: string]: any };

export class Product {
  view: View;
  product: ProductData;
  params: ProductComponentParams;
  statsSent: boolean;

  constructor(product: ProductData, params: ProductComponentParams = {}) {
    this.product = product;
    this.params = params;
    this.view = new ViewTemplate(html).cloneView();
    this.statsSent = false;
  }

  attach($root: HTMLElement) {
    $root.appendChild(this.view.root);
    window.addEventListener('scroll', this._handleScroll.bind(this));
  }

  render() {
    const { id, name, src, salePriceU } = this.product;

    this.view.root.setAttribute('href', `/product?id=${id}`);
    this.view.img.setAttribute('src', src);
    this.view.title.innerText = name;
    this.view.price.innerText = formatPrice(salePriceU);

    if (this.params.isHorizontal) this.view.root.classList.add('is__horizontal');
  }

  private async _getProductSecretKey(id: number) {
    try {
      const response = await fetch(`/api/getProductSecretKey?id=${id}`);
      const secretKey =  await response.json();
      return secretKey;
    } catch(error) {
      console.error('Ошибка при получении секретного ключа:', error);
    }
  }

  private _isElementInViewport(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  private _handleScroll() {
    if (this._isElementInViewport(this.view.root) && !this.statsSent) {
      this.statsSent = true;
      const logField = this.product.log;
      const secretKey = this._getProductSecretKey(this.product.id);
      if (Object.keys(logField).length === 0) {
        statisticsService.sendViewCardPromoStats(this.product, secretKey);
      } else {
        statisticsService.sendViewCardStats(this.product, secretKey);
      }
    }
  }
}
