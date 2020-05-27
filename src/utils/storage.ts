export default class LocalStorageUtil {
  public static GetStorage (field: string): any {
    const rawStorage: string|null = localStorage.getItem(field);
    return rawStorage
      ? JSON.parse(rawStorage)
      : null;
  }
  public static SetStorage (field: string, data: any): void {
    localStorage.setItem(field, JSON.stringify(data));
  }
};
