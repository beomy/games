<script lang="ts">
  import _ from 'lodash'
  import { Tile, Point } from '@/@types'
  import { number, array } from '@/utils'
  import TitleCell from '@/components/twoZeroFourEight/Tile.svelte'

  const rowCount = 4;
  const gridCount: Array<Number> = [];
  let remainPoint: Array<string> = [];
  let tiles: Array<Tile> = [];
  const historyMove: Array<Array<Tile>> = [];
  let score = 0;

  (function init (): void {
    for (let i = 1; i <= rowCount; i++) {
      for (let j = 1; j <= rowCount; j++) {
        remainPoint.push(`${i},${j}`);
      }
      gridCount.push(i);
    }

    for (const prefix of ['A', 'B']) {
      const newTile = getTile(prefix)
      tiles = [...tiles, newTile]
    }
  })()

  function popRemainPoint (point: string = null): Point {
    let index = remainPoint.indexOf(point) >= 0
      ? remainPoint.indexOf(point)
      : number.random(0, remainPoint.length - 1);
    const item = remainPoint.splice(index, 1).pop();
    if (item) {
      return new Point(Number(item.split(',')[0]), Number(item.split(',')[1]));
    } else {
      return null;
    }
  }

  function getTile (prefix: any = null): Tile {
    const remainPoint = popRemainPoint();
    if (remainPoint) {
      // TODO: 2점, 4점 확률 적용해야 함
      return new Tile(prefix, 2, remainPoint);
    } else {
      return null;
    }
  }

  function refactoryTile (newTile: Tile = null) {
    if (newTile) {
      tiles = [ ...tiles, newTile, ];
    }
    setTimeout(() => {
      tiles = tiles.filter(x => !x.isDelete);
    }, 100)
  }

  function handleKeydown ({ keyCode }): void {
    if (keyCode === 37) {
      moveTile('left');
    } else if (keyCode === 38) {
      moveTile('top');
    } else if (keyCode === 39) {
      moveTile('right');
    } else if (keyCode === 40) {
      moveTile('bottom');
    }
  }

  function moveTile (direction: string): void {
    const cloneTiles = _.cloneDeep(tiles)
    const tileGroup = directionTileGroup(direction);
    for (const [key, tileRow] of Object.entries(tileGroup)) {
      moveTileRow(tileRow, direction);
    }

    if (_.isEqual(cloneTiles, tiles)) {
      refactoryTile()
    } else {
      historyMove.push(cloneTiles)
      refactoryTile(getTile())
    }
    if (isGameOver()) {
      alert('GameOver')
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
      if (cur.number === pre.number) {
        pre.number += cur.number
        cur.isDelete = true
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

  function getPrevTile(tileRow: Array<Tile>, index: Number) {
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

  function isGameOver (): boolean {
    let isPossibleMove = false
    const groupRight = directionTileGroup('right')
    for (const [key, tiles] of Object.entries(groupRight)) {
      isPossibleMove = isPossibleMove || possibleMove(tiles, 'right');
    }
    const groupBottom = directionTileGroup('bottom')
    for (const [key, tiles] of Object.entries(groupBottom)) {
      isPossibleMove = isPossibleMove || possibleMove(tiles, 'bottom');
    }
    return !isPossibleMove && remainPoint.length === 0
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

  function directionTileGroup (direction: string): Object {
    const tileGroup = ['top', 'bottom'].includes(direction)
      ? _.groupBy(tiles, 'point.x')
      : _.groupBy(tiles, 'point.y')

    for (const [key, tiles] of Object.entries(tileGroup)) {
      tiles.sort((a, b) => {
        if (direction === 'bottom') {
          return b.point.y - a.point.y;
        } else if (direction === 'top') {
          return a.point.y - b.point.y;
        } else if (direction === 'right') {
          return b.point.x - a.point.x;
        } else if (direction === 'left') {
          return a.point.x - b.point.x;
        }
      })
    }

    return tileGroup;
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

  @media (max-width: $sm) {
    .game-container {
      padding: $smSpace;
      width: $smBox;
      height: $smBox;
    }
    .grid-row {
      margin-bottom: $smSpace;
    }
    .grid-cell {
      width: $smCell;
      height: $smCell;
      margin-right: $smSpace;
    }
  }
</style>

<svelte:window on:keydown={handleKeydown}/>

<div class="score-container">
  {score}
</div>
<div class="game-container">
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
