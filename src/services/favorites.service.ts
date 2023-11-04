import localforage from 'localforage';
import { ProductData } from 'types';

const FAVORITES_DB = '__wb-favorites';

class FavoritesService {
  init() {
    this._hasFavorites();
  }

  async addFavorite(product: ProductData) {
    const favorites = await this.getFavorites();
    if (!favorites.some(({ id }) => id === product.id)) {
      await this.setFavorites([...favorites, product]);
    }
  }

  async removeFavorite(product: ProductData) {
    const favorites = await this.getFavorites();
    const updatedFavorites = favorites.filter(({ id }) => id !== product.id);
    await this.setFavorites(updatedFavorites);
  }

  async clearFavorites() {
    await localforage.removeItem(FAVORITES_DB);
    this._hasFavorites();
  }

  async getFavorites(): Promise<ProductData[]> {
    return (await localforage.getItem(FAVORITES_DB)) || [];
  }

  async setFavorites(data: ProductData[]) {
    await localforage.setItem(FAVORITES_DB, data);
    this._hasFavorites();
  }

  async isInFavorites(product: ProductData): Promise<boolean> {
    const favorites = await this.getFavorites();
    return favorites.some(({ id }) => id === product.id);
  }

  private async _hasFavorites() {
    const favorites = await this.getFavorites();
    const favLinks = document.querySelectorAll('.js__fav-link') as NodeListOf<HTMLElement>;
    favLinks.forEach((element) => {
      if (favorites.length > 0) {
        element.style.display = 'block';
      } else {
        element.style.display = 'none';
      }
    });
  }
}

export const favoritesService = new FavoritesService();
