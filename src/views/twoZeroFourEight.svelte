<script lang="ts">
  import _ from 'lodash';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { Hammer, swipe } from 'svelte-hammer';
  import { Tile, Point } from '@/model';
  import { NumberUtil, LocalStorageUtil } from '@/utils';
  import TitleCell from '@/components/twoZeroFourEight/Tile.svelte';
  import GameScore from '@/components/GameScore.svelte';
  import GameNavigation from '@/components/GameNavigation.svelte';

  const rowCount: number = 4;
  const gridCount: number[] = [];
  const refPoint: string[] = [];
  let historyMove: Tile[][] = [];
  let historyScore: number[] = [];
  let remainPoint: string[] = [];
  let tiles: Tile[] = [];
  let score: number = 0;
  let bestScore: number = 0;
  let additionScore: number = 0;
  let isGameOver: boolean = false;

  enum Direction {
    TOP = 'top',
    RIGHT = 'right',
    BOTTOM = 'bottom',
    LEFT = 'left',
  }

  $: if (historyScore.length === 1) {
    additionScore = historyScore[historyScore.length - 1];
  } else if (historyScore.length > 1) {
    additionScore = historyScore[historyScore.length - 1] - historyScore[historyScore.length - 2];
  }

  $: {
    let isPossibleMove: boolean = false;
    const groupRight = directionTileGroup(Direction.RIGHT)
    for (const [key, tiles] of Object.entries(groupRight)) {
      isPossibleMove = isPossibleMove || possibleMove(tiles, Direction.RIGHT);
    }
    const groupBottom = directionTileGroup(Direction.BOTTOM)
    for (const [key, tiles] of Object.entries(groupBottom)) {
      isPossibleMove = isPossibleMove || possibleMove(tiles, Direction.BOTTOM);
    }
    isGameOver = !isPossibleMove && remainPoint.length === 0
  }

  $: {
    LocalStorageUtil.setStorage('2048Game', {
      results: historyMove,
      score: historyScore,
      best: bestScore
    })
  }

  $: {
    const historyTiles = getCoreTileValue(historyMove[historyMove.length - 1])
    const currentTiles = getCoreTileValue(tiles)
    if (!_.isEqual(historyTiles, currentTiles)) {
      historyMove = [ ...historyMove, _.cloneDeep(tiles) ]
      historyScore = [ ...historyScore, score ]
      bestScore = Math.max(bestScore, historyScore[historyScore.length - 1])
    }
  }

  (function init (): void {
    for (let i: number = 1; i <= rowCount; i++) {
      for (let j: number = 1; j <= rowCount; j++) {
        refPoint.push(`${i},${j}`);
      }
      gridCount.push(i);
    }
    remainPoint = _.cloneDeep(refPoint)

    const storage = LocalStorageUtil.getStorage('2048Game');
    historyMove = storage.results
    historyScore = storage.score
    bestScore = storage.best

    if (historyMove.length > 0) {
      tiles = historyMove[historyMove.length - 1]
    } else {
      for (const prefix of ['A', 'B']) {
        const newTile = getTile(prefix, 2)
        tiles = [...tiles, newTile]
      }
    }

    if (historyScore.length > 0) {
      score = historyScore[historyScore.length - 1]
    }
  })();

  function getCoreTileValue (target: Tile[]) {
    if (target) {
      return target.reduce((acc, cur) => {
        if (!cur.isDelete) {
          acc.push({
            id: cur.id,
            number: cur.number,
            point: cur.point
          })
        }
        return acc
      }, [])
    } else {
      return []
    }
  }

  function popRemainPoint (point: string|null = null): Point {
    let index = point && remainPoint.indexOf(point) >= 0
      ? remainPoint.indexOf(point)
      : NumberUtil.random(0, remainPoint.length - 1);
    const item = remainPoint.splice(index, 1).pop();
    if (item) {
      return new Point(Number(item.split(',')[0]), Number(item.split(',')[1]));
    } else {
      return null;
    }
  }

  function getTile (
    prefix: string|null = null,
    fixNumber: number|null = null,
    point: string|null = null
  ): Tile {
    const remainPoint: Point = popRemainPoint(point);
    if (remainPoint) {
      const number: number = fixNumber
        ? fixNumber
        : NumberUtil.ratioRandom([2, 4], [8, 2]);
      return new Tile(prefix, number, remainPoint);
    } else {
      return null;
    }
  }

  function refactoryTile (): void {
    const compactTiles = tiles.filter(x => !x.isDelete)
    tiles = compactTiles.map(x => ({
      ...x,
      isMerged: false
    }));
  }

  function pushTile (tile: Tile): void {
    tiles = [ ...tiles, tile ];
  }

  function handleKeydown ({ keyCode }: { keyCode: number; }): void {
    if (keyCode === 37) {
      moveTile(Direction.LEFT);
    } else if (keyCode === 38) {
      moveTile(Direction.TOP);
    } else if (keyCode === 39) {
      moveTile(Direction.RIGHT);
    } else if (keyCode === 40) {
      moveTile(Direction.BOTTOM);
    }
  }

  function moveTile (direction: Direction): void {
    refactoryTile()

    const cloneTiles = _.cloneDeep(tiles)
    const tileGroup = directionTileGroup(direction);
    for (const [key, tileRow] of Object.entries(tileGroup)) {
      moveTileRow(tileRow, direction);
    }

    if (!_.isEqual(cloneTiles, tiles)) {
      pushTile(getTile())
    }
  }

  function moveTileRow (tileRow: Array<Tile>, direction: string): void {
    calcTileNumber(tileRow)
    calcTilePoint(tileRow, direction)
    calcRemainPoint()
  }

  function calcTileNumber (tileRow: Array<Tile>): void {
    for (let index = 1; index < tileRow.length; index++) {
      const cur = tileRow[index]
      const pre = getPrevTile(tileRow, index)
      if (!pre.isMerged && cur.number === pre.number) {
        pre.number += cur.number
        cur.isDelete = true
        pre.isMerged = true
        score += pre.number
      }
    }
  }

  function calcTilePoint (tileRow: Array<Tile>, direction: string): void {
    const isAsc: boolean = ['top', 'left'].includes(direction);
    const pointField: string = ['top', 'bottom'].includes(direction) ? 'y' : 'x';
    const startPoint = isAsc ? 1 : rowCount
    const moveDirection = isAsc ? 1 : -1
    for (const cur of tileRow) {
      const index = tileRow.indexOf(cur)
      const pre = getPrevTile(tileRow, index)
      if (index === 0) {
        cur.point[pointField] = startPoint
      } else {
        cur.point[pointField] = cur.isDelete
          ? pre.point[pointField]
          : pre.point[pointField] + moveDirection
      }
    }
  }

  function getPrevTile(tileRow: Array<Tile>, index: number) {
    return tileRow.filter((x, i) => i < index && !x.isDelete).pop()
  }

  function possibleMove (tileRow: Array<Tile>, direction: string): boolean {
    const isAsc: boolean = ['top', 'left'].includes(direction);
    const pointField: string = ['top', 'bottom'].includes(direction) ? 'y' : 'x';

    const startPoint = isAsc ? 1 : rowCount
    const moveDirection = isAsc ? 1 : -1

    let result = false
    for (const cur of tileRow.filter(x => !x.isDelete)) {
      const index = tileRow.indexOf(cur)
      const pre = getPrevTile(tileRow, index)

      if (index === 0 || !pre) {
        if (cur.point[pointField] !== startPoint) {
          result = true
        }
      } else {
        if (cur.number === pre.number) {
          result = true
        } else if (cur.point[pointField] !== pre.point[pointField] + moveDirection) {
          result = true
        }
      }
    }
    return result
  }

  function calcRemainPoint (): void {
    const ref: Array<string> = []
    for (let i = 1; i <= rowCount; i++) {
      for (let j = 1; j <= rowCount; j++) {
        ref.push(`${i},${j}`);
      }
    }
    for (const tile of tiles.filter(x => !x.isDelete)) {
      ref.splice(ref.indexOf(`${tile.point.x},${tile.point.y}`), 1)
    }
    remainPoint = ref
  }

  function directionTileGroup (direction: Direction): { [x: number]: Tile[] } {
    const tileGroup: { [x: number]: Tile[] } = [Direction.TOP, Direction.BOTTOM].includes(direction)
      ? _.groupBy(tiles, 'point.x')
      : _.groupBy(tiles, 'point.y')

    for (const [key, tileRow] of Object.entries(tileGroup)) {
      tileRow.sort((a: Tile, b: Tile) => {
        if (direction === Direction.BOTTOM) {
          return b.point.y - a.point.y;
        } else if (direction === Direction.TOP) {
          return a.point.y - b.point.y;
        } else if (direction === Direction.RIGHT) {
          return b.point.x - a.point.x;
        } else {
          return a.point.x - b.point.x;
        }
      })
    }

    return tileGroup;
  }

  function prevCancel (): void {
    if (historyMove.length > 1) {
      tiles = _.cloneDeep(historyMove[historyMove.length - 2])
      score = historyScore[historyScore.length - 2]
      historyMove.length = historyMove.length - 1
      historyScore.length = historyScore.length - 1
      calcRemainPoint()
    }
  }

  function newGame (): void {
    remainPoint = _.cloneDeep(refPoint)
    historyMove = []
    historyScore = []
    tiles = [ getTile('A', 2), getTile('B', 2) ]
    score = 0
    calcRemainPoint()
  }
</script>

<style lang="scss">
  @import "../assets/sass/variables.scss";
  @import "../assets/sass/variables_2048.scss";

  .game-container {
    position: relative;
    padding: $space;
    touch-action: none;
    background: #bbada0;
    border-radius: 6px;
    width: $box;
    height: $box;
    box-sizing: border-box;
    margin: auto;
    user-select: none;
    overflow: hidden;
  }
  .scores-container {
    width: $box;
    margin: auto auto 10px auto;
    text-align: right;
  }
  .navigation-container {
    width: $box;
    text-align: right;
    margin: 10px auto auto auto;
  }
  .grid-container {
    position: absolute;
    z-index: 1;
  }
  .grid-row {
    margin-bottom: $space;
    overflow: hidden;
  }
  .grid-cell {
    width: $cell;
    height: $cell;
    margin-right: $space;
    float: left;
    border-radius: 3px;
    background: rgba(238, 228, 218, 0.35);
  }

  .tile-container {
    position: absolute;
    z-index: 2;
  }

  .game-over {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 3;
    display: table;
    > div {
      display: table-cell;
      vertical-align: middle;
      text-align: center;
      color: #fff;
      font-size: 50px;
    }
  }

  @media (max-width: $sm) {
    .game-container {
      padding: $smSpace;
      width: $smBox;
      height: $smBox;
    }
    .scores-container, .navigation-container {
      width: $smBox;
    }
    .grid-row {
      margin-bottom: $smSpace;
    }
    .grid-cell {
      width: $smCell;
      height: $smCell;
      margin-right: $smSpace;
    }
    .game-over {
      > div {
        font-size: 30px;
      }
    }
  }
</style>

<svelte:window on:keydown={handleKeydown}/>

<div class="scores-container">
  <GameScore
    title="2048"
    {score} 
    best={bestScore}
    addition={additionScore}
  />
</div>
<div
  class="game-container"
  use:swipe={{ direction: Hammer.DIRECTION_ALL }}
  on:swipeleft={() => moveTile('left')}
  on:swiperight={() => moveTile('right')}
  on:swipeup={() => moveTile('top')}
  on:swipedown={() => moveTile('bottom')}
>
  {#if isGameOver}
    <div
      in:fade={{ duration: 100 }}
      class="game-over"
    >
      <div>GAME OVER</div>
    </div>
  {/if}
  <div class="grid-container">
    {#each gridCount as row}
      <div class="grid-row">
        {#each gridCount as cell}
          <div class="grid-cell"></div>
        {/each}
      </div>
    {/each}
  </div>
  <div class="tile-container">
    {#each tiles as tile (tile.id)}
      <TitleCell {tile} />
    {/each}
  </div>
</div>
<div class="navigation-container">
  <GameNavigation
    on:prevCancel={prevCancel}
    on:newGame={newGame}
  />
</div>
