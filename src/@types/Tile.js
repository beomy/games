export default class Tile {
  constructor (number, point) {
    this.number = number;
    this.point = point;
    this.score = 0;
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

  getScore () {
    return this.score;
  }
}