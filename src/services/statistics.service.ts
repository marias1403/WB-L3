import {ProductData} from "../../types";

const TYPE_ROUTE = 'route';
const TYPE_VIEW_CARD = 'viewCard';
const TYPE_ADD_TO_CART = 'addToCart';
const TYPE_PURCHASE = 'purchase';

class StatisticsService {
  async sendRouteStats(route: string) {
    return this._sendStats(TYPE_ROUTE, {
      url: route,
    });
  }

  async sendViewCardStats(data: ProductData, secretKey: string) {
    return this._sendStats(TYPE_VIEW_CARD, {
      ...data,
      secretKey: secretKey
    });
  }

  async sendAddToCartStats(data: ProductData) {
    return this._sendStats(TYPE_ADD_TO_CART, data);
  }

  async sendPurchaseStats(orderId: number, totalPrice: number, productIds: number[]) {
    return this._sendStats(TYPE_PURCHASE, {
      orderId: orderId,
      totalPrice: totalPrice,
      productIds: productIds
    })
  }

  private async _sendStats(type: string, payload: any) {
    try {
      const response = await fetch('/api/sendEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: type,
          payload: payload,
          timestamp: Date.now()
        })
      });
      return await response.json();
    } catch (error) {
      console.error('Ошибка при отправке статистики:', error);
    }
  }
}

export const statisticsService = new StatisticsService();
