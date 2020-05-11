export default class LocalStorageUtil {
  static getStorage (field: string = '2048Game'): IStorage {
    const rawStorage: string|null = localStorage.getItem(field);
    return rawStorage
      ? JSON.parse(rawStorage)
      : { results: [], score: [], best: 0 };
  }
  static setStorage (field: string = '2048Game', data: any) {
    localStorage.setItem(field, JSON.stringify(data));
  }
};
