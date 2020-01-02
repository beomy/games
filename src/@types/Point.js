export default class Point {
  constructor (x, y) {
    this.x = x;
    this.y = y;
  }

  get () {
    return {
      x: this.x,
      y: this.y,
    }
  }

  set (x, y) {
    this.x = x;
    this.y = y;
  }

  setX (x) {
    this.x = x;
  }

  setY (y) {
    this.y = y;
  }
}
