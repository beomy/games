export default class LocalStorageUtil {
  static getStorage (field: string): IStorage {
    const rawStorage: string|null = localStorage.getItem(field);
    return rawStorage
      ? JSON.parse(rawStorage)
      : {};
  }
  static setStorage (field: string, data: any) {
    localStorage.setItem(field, JSON.stringify(data));
  }
};
