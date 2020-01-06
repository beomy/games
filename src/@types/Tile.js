export default class Tile {
  constructor (prefix, number, point) {
    this.id = prefix ? `${prefix}${Date.now()}` : Date.now()
    this.number = number;
    this.point = point;
    this.isDelete = false;
  }

  getPos () {
    return this.point;
  }
  setPos (point) {
    this.point = point;
  }

  getNumber () {
    return this.number;
  }
  setNumber (number) {
    this.number = number;
  }
}