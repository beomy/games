<script lang="ts">
  import _ from 'lodash';
  import Point from '@/model/Point'
  import SudokuCell from '@/model/sudoku/Cell';
  import { ArrayUtil, MatrixUtil, NumberUtil, LocalStorageUtil, ObjectUtil } from '@/utils';
  import Cell from '@/components/sudoku/Cell.svelte';
  import NumberPad from '@/components/sudoku/Numberpad.svelte';
  import GameNavigation from '@/components/GameNavigation.svelte';
  import Timer from '@/components/global/Timer.svelte';
  import { remaindHintCount } from '@/stores/navHint';
  import { noteFlag } from '@/stores/navNote';
  import { mode, spandTime } from '@/stores/timer';

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

  const blinkSudoku: number[][] = [
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
  const blinkSudokuCell = sudokuToCell(blinkSudoku);
  let selectedDifficulty: Difficulty = Difficulty.EASY;
  let sudokuSolution: SudokuCell[][] = blinkSudokuCell;
  let sudokuQuiz: SudokuCell[][] = blinkSudokuCell;
  let currentCell: SudokuCell|null = null;
  let currentFocusPoints: Point[] = [];
  let confictPoints: Point[] = [];
  let history: any[] = [];
  let isMaking: boolean = false;

  $: viewSudoku = $mode == 'play' ? sudokuQuiz : blinkSudokuCell;
  $: currentFocusPoints = currentCell ? _.flatten(getFocusPointsList(currentCell.point)) : [];
  $: {
    let confictCells: SudokuCell[] = [];
    for (const rows of sudokuQuiz) {
      for (const item of rows) {
        const focusPointsList: Point[][] = getFocusPointsList(item.point);
        for (const focusPoints of focusPointsList) {
          const cells: SudokuCell[] = pointToSudokuCell(focusPoints, sudokuQuiz);
          const conficts = cells.filter(x => x.value !== 0 &&
            cells.filter(y => y.value === x.value).length > 1);
          confictCells = confictCells.concat(conficts);
        }
      }
    }
    confictPoints = confictCells.map(x => x.point);
  }
  $: {
    LocalStorageUtil.setStorage('sudoku.results', history);
  }
  $: {
    LocalStorageUtil.setStorage('sudoku.remaindHintCount', $remaindHintCount);
  }
  $: {
    LocalStorageUtil.setStorage('sudoku.solution', sudokuSolution);
  }
  $: {
    LocalStorageUtil.setStorage('sudoku.timer', $spandTime);
  }

  (function () {
    history = LocalStorageUtil.getStorage('sudoku.results');
    if (ObjectUtil.IsEmpty(history)) {
      init();
    } else {
      $remaindHintCount = LocalStorageUtil.getStorage('sudoku.remaindHintCount');
      const quize = _.cloneDeep(history[history.length - 1]);
      const solution = LocalStorageUtil.getStorage('sudoku.solution');
      sudokuQuiz = quize.map(x => x.map(y => SudokuCell.ToSudokuCell(y)));
      sudokuSolution = solution.map(x => x.map(y => SudokuCell.ToSudokuCell(y)));
      $mode = 'play';
      $spandTime = LocalStorageUtil.getStorage('sudoku.timer');
    }
  })();

  function init (): void {
    isMaking = true;
    $mode = 'pause';
    const sudokuRef = makeSudoku();
    const { quiz, emptyPoints, invalidPoints }: IQuzyDetail = makeSudokuQuiz(sudokuRef);
    if (!isVaildDifficulty(emptyPoints)) {
      setTimeout(() => init());
    } else {
      sudokuSolution = sudokuToCell(sudokuRef);
      currentCell = null;
      $remaindHintCount = 3;
      sudokuQuiz = quiz;
      history = [_.cloneDeep(sudokuQuiz)];
      $mode = 'play';
      $spandTime = 0;
      isMaking = false;
    }
  };

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
        quiz[point.y][point.x].setFreeze(false);
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

    return [ squire, row, col ]
  }

  function onClickCell (event) {
    currentCell = event.detail.cell;
  }

  function onNoteFlag () {
    if ($mode === 'pause') {
      $mode = 'play';
      return;
    }
    $noteFlag = !$noteFlag;
  }

  function onClickPadNumber ({ detail }) {
    const num: number = detail.number;
    if ($noteFlag) {
      currentCell.toggleCandidate(num);
    } else {
      currentCell.setValue(num);
    }
    sudokuQuiz = sudokuQuiz;
    history = [...history, _.cloneDeep(sudokuQuiz)];
  }

  function onRemove () {
    if ($mode === 'pause') {
      $mode = 'play';
      return;
    }
    currentCell.setValue(0);
    currentCell.setCandidateValues([]);
    sudokuQuiz = sudokuQuiz;
    history = [...history, _.cloneDeep(sudokuQuiz)];
  }

  function onHint () {
    if ($mode === 'pause') {
      $mode = 'play';
      return;
    }
    const point: Point = currentCell.point
    currentCell.setValue(sudokuSolution[point.y][point.x].value);
    if (!currentCell.freeze) {
      $remaindHintCount -= 1;
    }
    sudokuQuiz = sudokuQuiz;
    history = [...history, _.cloneDeep(sudokuQuiz)];
  }

  function onNewGame () {
    init();
  }

  function onUndo () {
    if ($mode === 'pause') {
      $mode = 'play';
      return;
    }
    if (history.length > 1) {
      history.pop();
      history = history;
      const quiz = _.cloneDeep(history[history.length - 1]);
      sudokuQuiz = quiz.map(x => x.map(y => SudokuCell.ToSudokuCell(y)));
      currentCell = sudokuQuiz[currentCell.point.y][currentCell.point.x];
    }
  }
</script>

<div class="game-info-wrapper">
  <Timer />
</div>
<div class="game-wrapper">
  {#if isMaking}
    <div class="game-dim" style="background-color: rgba(255, 255, 255, 0.8);font-size: 25px;">
      새로운 게임을 생성중입니다.
    </div>
  {:else if $mode === 'pause'}
    <div class="game-dim">
      <div
        class="icon"
        on:click={() => $mode = 'play'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" id="icon-play-big"><g fill="none" fill-rule="evenodd"><circle cx="30" cy="30" r="30" fill="#4A90E2"/><path fill="#FFF" d="M39.123 31.978L26.56 40.615a2.4 2.4 0 0 1-3.76-1.977V21.362a2.4 2.4 0 0 1 3.76-1.977l12.563 8.637a2.4 2.4 0 0 1 0 3.956z"/></g></svg>
      </div>
    </div>
  {/if}
  <div class="game">
    <table class="game-table">
      <tbody>
        {#each viewSudoku as rows, i (i)}
          <tr class="game-row">
            {#each rows as item, j (j)}
              <td
                class:selected={currentCell ? item.point.isEqual(currentCell.point) : false}
                class:highlight-table={currentFocusPoints.find(x => x.isEqual(new Point(j, i)))}
                class:highlight-number={item.value !== 0 && currentCell && item.value === currentCell.value}
                class:confict={confictPoints.find(x => x.isEqual(new Point(j, i)))}
              >
                <Cell
                  cell={item}
                  on:click={onClickCell}
                />
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
<div class="game-controls-wrapper">
  <GameNavigation
    list={['undo', 'remove', 'note', 'hint', 'new']}
    on:newGame={onNewGame}
    on:note={onNoteFlag}
    on:remove={onRemove}
    on:hint={onHint}
    on:undo={onUndo}
  />
  <NumberPad on:click={onClickPadNumber}/>
</div>

<!--<div class="solution" style="display: inline-block; margin-left: 10px;">
  {#each sudokuSolution as rows, i (i)}
    <div>
      {#each rows as item, j (j)}
        <span class:empty={item.value === 0}>{ item.value }</span>
      {/each}
    </div>
  {/each}
</div>

<div class="solution" style="display: inline-block; margin-left: 10px;">
  {#each sudokuQuiz as rows, i (i)}
    <div>
      {#each rows as item, j (j)}
        <span class:empty={item.value === 0}>{ item.value }</span>
      {/each}
    </div>
  {/each}
</div>-->

<style lang="scss">
  .game-info-wrapper {
    text-align: right;
    margin-bottom: 5px;
    max-width: 600px;
    min-width: 300px;
    margin-left: auto;
    margin-right: auto;
  }
  .game-controls-wrapper {
    max-width: 600px;
    min-width: 300px;
    margin-left: auto;
    margin-right: auto;
  }
  .game-wrapper {
    position: relative;
    margin-bottom: 10px;
    max-width: 600px;
    min-width: 300px;
    margin-left: auto;
    margin-right: auto;
    .game-dim {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      text-align: center;
      z-index: 1;
      &:before {
        content: '';
        height: 100%;
        display: inline-block;
        vertical-align: middle;
      }
      .icon {
        vertical-align: middle;
        display: inline-block;
        cursor: pointer;
      }
    }
    &:after {
      content: "";
      display: block;
      padding-bottom: 100%;
    }
    tbody {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      overflow: hidden;
      td {
        flex-basis: 11.1111%;
        box-sizing: border-box;
        position: relative;
        border-right: 1px solid #bec6d4;
        border-bottom: 1px solid #bec6d4;
        cursor: pointer;
        transform: translateZ(0);
        &.highlight-table {
          background-color: #e2e7ed;
        }
        &.highlight-number {
          background-color: #cbdbed;
        }
        &.confict {
          background-color: #f7cfd6;
        }
        &.selected {
          background-color: #bbdefb;
        }
      }
      &:after {
        box-sizing: border-box;
        width: 100%;
        display: block;
        content: "";
        position: absolute;
        left: 0;
        top: 33.3333%;
        height: 33.4%;
        border-top: 2px solid #344861;
        border-bottom: 2px solid #344861;
        pointer-events: none;
      }
    }
    .game-row {
      display: flex;
      height: 11.1111%;
    }
    .game {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
    .game-table {
      display: block;
      box-sizing: border-box;
      height: 100%;
      width: 100%;
      border: 2px solid #344861;
      padding: 0;
      margin: 0;
      &:after {
        content: "";
        position: absolute;
        left: 33.3333%;
        width: 33.3333%;
        top: 0;
        border-left: 2px solid #344861;
        border-right: 2px solid #344861;
        pointer-events: none;
        display: block;
        box-sizing: border-box;
        height: 100%
      }
    }
  }
</style>
