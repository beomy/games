import Point from '../Point';

export default class SudokuCell {
  value: number;
  candidateValues: number[] = [];
  point: Point;

  constructor (value, point) {
    this.value = value;
    this.point = point;
  }

  toggleCandidate (value: number) {
    const index = this.candidateValues.indexOf(value);
    if (index >= 0) {
      this.candidateValues.splice(index, 1);
    } else {
      this.candidateValues.push(value);
      this.candidateValues.sort((a, b) => a - b);
    }
  }
};
