<script lang="ts">
  import _ from 'lodash';
  import Point from '@/model/Point'
  import SudokuCell from '@/model/sudoku/Cell';
  import { ArrayUtil, MatrixUtil, NumberUtil } from '@/utils';
  import Cell from '@/components/sudoku/Cell.svelte';

  interface IQuzyDetail {
    quiz: SudokuCell[][];
    emptyPoints: Point[];
    invalidPoints: Point[];
  }

  enum Difficulty {
    EASY = 43,
    NORMAL = 50,
    HARD = 55,
  };

  let selectedDifficulty: Difficulty = Difficulty.EASY;
  let sudokuRef: number[][] = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
  let sudokuSolution: SudokuCell[][] = sudokuToCell(sudokuRef);
  let sudokuQuiz: SudokuCell[][] = makeSudokuQuiz(sudokuRef).quiz;

  (function init (): void {
    sudokuRef = makeSudoku();
    sudokuSolution = sudokuToCell(sudokuRef);
    const { quiz, emptyPoints, invalidPoints }: IQuzyDetail = makeSudokuQuiz(sudokuRef);
    if (!isVaildDifficulty(emptyPoints)) {
      setTimeout(() => init());
    } else {
      sudokuQuiz = quiz;
    }
  })();

  function makeSudoku (): number[][] {
    const x1: number[][] = [ [0, 0, 1], [1, 0, 0], [0, 1, 0] ];
    const x2: number[][] = [ [0, 1, 0], [0, 0, 1], [1, 0, 0] ];
    const s: number[][] = ArrayUtil.toMatrix(ArrayUtil.mix([1, 2, 3, 4, 5, 6, 7, 8, 9]), 3);
    const x1s: number[][] = MatrixUtil.multiply(x1, s);
    const x2s: number[][] = MatrixUtil.multiply(x2, s);
    const sx1: number[][] = MatrixUtil.multiply(s, x1);
    const x2sx1: number[][] = MatrixUtil.multiply(x2s, x1);
    const x1sx1: number[][] = MatrixUtil.multiply(x1s, x1);
    const sx2: number[][] = MatrixUtil.multiply(s, x2);
    const x1sx2: number[][] = MatrixUtil.multiply(x1s, x2);
    const x2sx2: number[][] = MatrixUtil.multiply(x2s, x2);

    return [
      s[0].concat(x1s[0]).concat(x2s[0]),
      s[1].concat(x1s[1]).concat(x2s[1]),
      s[2].concat(x1s[2]).concat(x2s[2]),
      sx1[0].concat(x1sx1[0]).concat(x2sx1[0]),
      sx1[1].concat(x1sx1[1]).concat(x2sx1[1]),
      sx1[2].concat(x1sx1[2]).concat(x2sx1[2]),
      sx2[0].concat(x1sx2[0]).concat(x2sx2[0]),
      sx2[1].concat(x1sx2[1]).concat(x2sx2[1]),
      sx2[2].concat(x1sx2[2]).concat(x2sx2[2]),
    ];
  }

  function sudokuToCell (sudoku: number[][]): SudokuCell[][] {
    const cells: SudokuCell[][] = [];
    for (let y = 0; y < sudoku.length; y++) {
      const rows: SudokuCell[] = [];
      for (let x = 0; x < sudoku[y].length; x++) {
        rows.push(new SudokuCell(sudoku[y][x], new Point(x, y)));
      }
      cells.push(rows);
    }
    return cells;
  }

  function isVaildDifficulty (emptyPoints: Point[]) {
    const length: number = emptyPoints.length;
    if (selectedDifficulty === Difficulty.EASY) {
      return length >= Difficulty.EASY && length < Difficulty.NORMAL;
    } else if (selectedDifficulty === Difficulty.NORMAL) {
      return length >= Difficulty.NORMAL && length < Difficulty.HARD;
    } else {
      return length >= Difficulty.HARD;
    }
  }

  function makeSudokuQuiz (sudoku: number[][]): IQuzyDetail {
    const quiz: SudokuCell[][] = sudokuToCell(sudoku);
    const emptyPoints: Point[] = [];
    const invalidPoints: Point[] = [];
    while(!isVaildDifficulty(emptyPoints)) {
      const emptyNumbers = emptyPoints.map(x => x.toNumber(9));
      const invalidNumbers = invalidPoints.map(x => x.toNumber(9));
      const rand = NumberUtil.uniqueRandom(0, 80, [...emptyNumbers, ...invalidNumbers]);
      if (rand === null) {
        break;
      }
      const point: Point = Point.ToPoint(rand, 9);
      const ori = quiz[point.y][point.x].value;
      quiz[point.y][point.x].value = 0;
      const result = solve(_.cloneDeep(quiz), [ point, ...emptyPoints ]);
      if (!result) {
        quiz[point.y][point.x].value = ori;
        invalidPoints.push(point);
      } else {
        emptyPoints.push(point);
      }
    }
    return {
      quiz,
      emptyPoints,
      invalidPoints,
    };
  }

  function solve (quiz: SudokuCell[][], emptyPoints: Point[]): boolean {
    let result = true;
    for (const emptyPoint of emptyPoints) {
      const emptyCell = quiz[emptyPoint.y][emptyPoint.x];
      const focusPointsList: Point[][] = getFocusPointsList(emptyCell.point);
      const candidateList: number[][] = []
      for (const focusPoints of focusPointsList) {
        const cells: SudokuCell[] = pointToSudokuCell(focusPoints, quiz);
        candidateList.push(getCandidateValues(cells));
      }
      const candidateValues = _.intersection(...candidateList);
      if (candidateValues.length === 1) {
        emptyCell.value = candidateValues[0];
        emptyCell.candidateValues = [];
        result = result && solve(quiz, emptyPoints.filter(x => !x.isEqual(emptyPoint)));
      } else if (emptyCell.value && candidateValues.length === 0) {
        result = true;
      } else {
        emptyCell.candidateValues = candidateValues;
        result = false;
      }
    }
    return result;
  }

  function getCandidateValues (cells: SudokuCell[]): number[] {
    const ref = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const values = cells.map(x => x.value);
    return _.difference(ref, values)
  }

  function pointToSudokuCell (points: Point[], sudoku: SudokuCell[][]) {
    const sudokuCells: SudokuCell[] = [];
    for (const rows of sudoku) {
      for (const item of rows) {
        if (points.find(x => x.isEqual(item.point))) {
          sudokuCells.push(item);
        }
      }
    }
    return sudokuCells;
  }

  function getFocusPointsList (point: Point): Point[][] {
    const startX = Math.floor(point.x / 3) * 3;
    const endX = (Math.floor(point.x / 3) + 1) * 3 - 1;
    const startY = Math.floor(point.y / 3) * 3;
    const endY = (Math.floor(point.y / 3) + 1) * 3 - 1;

    const squire: Point[] = [];
    for (let i = startX; i <= endX; i++) {
      for (let j = startY; j <= endY; j++) {
        squire.push(new Point(i, j));
      }
    }
    const row: Point[] = [];
    for (let i = 0; i < 9; i++) {
      row.push(new Point(i, point.y));
    }
    const col: Point[] = [];
    for (let j = 0; j < 9; j++) {
      col.push(new Point(point.x, j));
    }
    
    const points: Point[][] = [ squire, row, col ];

    if (point.x === point.y) {
      const row: Point[] = [];
      for (let i = 0; i < 9; i++) {
        row.push(new Point(i, i));
      }
      points.push(row);
    }
    if (point.x + point.y === 8) {
      const row: Point[] = [];
      for (let i = 0; i < 9; i++) {
        row.push(new Point(i, 8 - i));
      }
      points.push(row);
    }

    return points
  }

</script>

<div class="solution">
  {#each sudokuSolution as rows, i (i)}
    <div>
      {#each rows as item, j (j)}
        <span class:empty={item.value === 0}>{ item.value }</span>
      {/each}
    </div>
  {/each}
</div>

<div class="quiz">
  {#each sudokuQuiz as rows, i (i)}
    <div>
      {#each rows as item, j (j)}
        <span class:empty={item.value === 0}>{ item.value }</span>
      {/each}
    </div>
  {/each}
</div>


<div class="quiz">
  {#each sudokuQuiz as rows, i (i)}
    <div>
      {#each rows as item, j (j)}
        <Cell cell={item} />
        <!-- <span class:empty={item.value === 0}>{ item.value }</span> -->
      {/each}
    </div>
  {/each}
</div>

<style lang="scss">
  .solution {
    margin-bottom: 10px;
    .empty {
      background-color: red;
    }
  }
  .quiz {
    .empty {
      background-color: red;
    }
  }
</style>
