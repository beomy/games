<script lang="ts">
  import { Tile, Point } from '@/@types'
  import { number, array } from '@/utils'
  import TitleCell from '@/components/twoZeroFourEight/Tile.svelte'

  const rowCount = 4;
  let remainPoint: Array<string> = [];
  const gridCount: Array<Number> = [];
  let tiles: Array<Tile> = [];

  (function init (): void {
    for (let i = 1; i <= rowCount; i++) {
      for (let j = 1; j <= rowCount; j++) {
        remainPoint.push(`${i},${j}`);
      }
      gridCount.push(i);
    }
  })()

  function popRemainPoint (): Point {
    const index = number.random(0, remainPoint.length - 1);
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

  function pushTile (newTile) {
    tiles = [ ...tiles, newTile, ];
    setTimeout(() => {
      tiles = tiles.filter(x => !x.isDup);
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
    const tileGroup = directionTileGroup(direction);
    for (const [key, tiles] of Object.entries(tileGroup)) {
      moveStack(tiles, direction);
    }

    // TODO: 이전 타일 모양과 다를 경우만 가져오도록 해야 함
    const newTile = getTile();
    if (newTile) {
      pushTile(newTile)
    }
    if (isGameOver()) {
      // TODO: GameOver 화면 구현
    }
  }

  // TODO: 미완성, 버그 수정 필요
  function moveStack (tileGroup: Array<Tile>, direction: string): void {
    const isAsc: Boolean = ['top', 'left'].includes(direction);
    const pointField: string = ['top', 'bottom'].includes(direction) ? 'y' : 'x';

    if (isAsc) {

    } else {
      for (const tile of tileGroup) {
        const index = tileGroup.indexOf(tile)
        if (index === 0) {
          tile.point[pointField] = rowCount
        } else {
          const preTile = tileGroup[index - 1]
          let point = preTile.point[pointField] - 1 > 0
              ? preTile.point[pointField] - 1
              : 1
          if (tile.number === preTile.number) {
            point = preTile.point[pointField]
            preTile.number += tile.number;
            tile.isDup = true;
          }
          tile.point[pointField] = point
        }
      }
    }

    calcRemainPoint()
  }

  // TODO: GameOver 조건 구현
  function isGameOver (): Boolean {
    return false
  }

  function calcRemainPoint (): void {
    const ref: Array<string> = []
    for (let i = 1; i <= rowCount; i++) {
      for (let j = 1; j <= rowCount; j++) {
        ref.push(`${i},${j}`);
      }
    }
    for (const tile of tiles.filter(x => !x.isDup)) {
      ref.splice(ref.indexOf(`${tile.point.x},${tile.point.y}`), 1)
    }
    remainPoint = ref
  }

  function directionTileGroup (direction: string): Object {
    let tileGroup = [];

    if (['top', 'bottom'].includes(direction)) {
      tileGroup = array.groupBy(tiles, 'point.x');
    } else {
      tileGroup = array.groupBy(tiles, 'point.y');
    }

    for (const [key, tiles] of Object.entries(tileGroup)) {
      tiles.sort((a, b) => {
        if (direction === 'bottom') {
          return b.point.getY() - a.point.getY();
        } else if (direction === 'top') {
          return a.point.getY() - b.point.getY();
        } else if (direction === 'right') {
          return b.point.getX() - a.point.getX();
        } else if (direction === 'left') {
          return a.point.getX() - b.point.getX();
        }
      })
    }

    return tileGroup;
  }

  for (const prefix of ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']) {
    const newTile = getTile(prefix)
    tiles = [...tiles, newTile]
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
