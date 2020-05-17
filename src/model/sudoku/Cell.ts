import Point from '../Point';

export default class SudokuCell {
  value: number;
  candidateValues: number[] = [];
  point: Point;
  private freeze: boolean = true;

  constructor (value, point) {
    this.value = value;
    this.point = point;
    this.freeze = value !== 0;
  }

  toggleCandidate (value: number) {
    if (this.freeze) {
      return;
    }
    const index = this.candidateValues.indexOf(value);
    if (index >= 0) {
      this.candidateValues.splice(index, 1);
    } else {
      this.candidateValues.push(value);
      this.candidateValues.sort((a, b) => a - b);
    }
  }

  setCandidateValues (value: number[]) {
    if (!this.freeze) {
      this.candidateValues = value;
    }
  }

  setFreeze (value: boolean) {
    this.freeze = value;
  }

  setValue (value: number) {
    if (!this.freeze) {
      this.value = value;
    }
  }

  static ToSudokuCell (obj: any): SudokuCell {
    return new SudokuCell(obj.value, new Point(obj.point.x, obj.point.x));
  }
};