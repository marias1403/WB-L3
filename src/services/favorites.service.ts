import localforage from 'localforage';
import { ProductData } from 'types';

const FAVORITES_DB = '__wb-favorites';

class FavoritesService {
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
  }

  async getFavorites(): Promise<ProductData[]> {
    return (await localforage.getItem(FAVORITES_DB)) || [];
  }

  async setFavorites(data: ProductData[]) {
    await localforage.setItem(FAVORITES_DB, data);
  }

  async isInFavorites(product: ProductData): Promise<boolean> {
    const favorites = await this.getFavorites();
    return favorites.some(({ id }) => id === product.id);
  }
}

export const favoritesService = new FavoritesService();
