export default class Tile {
  constructor (prefix, number, point) {
    this.id = prefix ? `${prefix}${Date.now()}` : Date.now()
    this.number = number;
    this.point = point;
    this.isDelete = false;
  }
}