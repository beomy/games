import Point from './Point'

export default class Tile {
  id: string;
  number: number;
  point: Point;
  isDelete: boolean = false;
  isMerged: boolean = false;

  constructor (prefix: string|null, number: number, point: Point) {
    this.id = prefix ? `${prefix}${Date.now()}` : Date.now().toString()
    this.number = number;
    this.point = point;
  }
}