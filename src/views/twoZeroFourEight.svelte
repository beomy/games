<script lang="ts">
  import { onMount } from 'svelte';
  import _ from 'lodash'
  import Hammer from 'hammerjs'
  import { Tile, Point } from '@/@types'
  import * as utils from '@/utils'
  import TitleCell from '@/components/twoZeroFourEight/Tile.svelte'
  import GameScore from '@/components/GameScore.svelte'
  import GameNavigation from '@/components/GameNavigation.svelte'

  const rowCount = 4;
  const gridCount: Array<number> = [];
  let historyMove: Array<Array<Tile>> = [];
  let historyScore: Array<number> = [];
  let remainPoint: Array<string> = [];
  let tiles: Array<Tile> = [];
  let score: number = 0;
  let bestScore: number = 0;
  let additionScore: number = 0;
  let gameContainer: any;

  $: if (historyScore.length === 1) {
    additionScore = historyScore[historyScore.length - 1]
  } else if (historyScore.length > 1) {
    additionScore = historyScore[historyScore.length - 1] - historyScore[historyScore.length - 2]
  }

  $: {
    setStorage('2048Game', {
      results: historyMove,
      score: historyScore,
      best: bestScore
    })
  }

  $: {
    if (!_.isEqual(historyMove[historyMove.length - 1], tiles)) {
      historyMove = [ ...historyMove, _.cloneDeep(tiles) ]
      historyScore = [ ...historyScore, score ]
      bestScore = Math.max(bestScore, historyScore[historyScore.length - 1])
    }
  }

  onMount(() => {
    const gameController = new Hammer(gameContainer);
    gameController.get('swipe').set({ direction: Hammer.DIRECTION_ALL })
    gameController.on('swipeleft', (event) => { moveTile('left'); })
    gameController.on('swiperight', (event) => { moveTile('right'); })
    gameController.on('swipeup', (event) => { moveTile('top'); })
    gameController.on('swipedown', (event) => { moveTile('bottom'); })
  });

  (function init (): void {
    for (let i = 1; i <= rowCount; i++) {
      for (let j = 1; j <= rowCount; j++) {
        remainPoint.push(`${i},${j}`);
      }
      gridCount.push(i);
    }

    const storage = getStorage('2048Game');
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

  function getStorage (field: any = '2048Game'): any {
    return JSON.parse(localStorage.getItem(field)) || { results: [], score: [], best: 0 };
  }

  function setStorage (field: any = '2048Game', data): void {
    localStorage.setItem(field, JSON.stringify(data));
  }

  function popRemainPoint (point: string = null): Point {
    let index = remainPoint.indexOf(point) >= 0
      ? remainPoint.indexOf(point)
      : utils.number.random(0, remainPoint.length - 1);
    const item = remainPoint.splice(index, 1).pop();
    if (item) {
      return new Point(Number(item.split(',')[0]), Number(item.split(',')[1]));
    } else {
      return null;
    }
  }

  function getTile (prefix: any = null, fixNumber: number = null): Tile {
    const remainPoint = popRemainPoint();
    if (remainPoint) {
      return new Tile(prefix, fixNumber ? fixNumber : utils.number.ratioRandom([2, 4], [8, 2]), remainPoint);
    } else {
      return null;
    }
  }

  function refactoryTile () {
    const compactTiles = tiles.filter(x => !x.isDelete)
    if (tiles.length !== compactTiles.length) {
      tiles = compactTiles;
    }
  }

  function pushTile (tile) {
    tiles = [ ...tiles, tile ]
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
    refactoryTile()

    const cloneTiles = _.cloneDeep(tiles)
    const tileGroup = directionTileGroup(direction);
    for (const [key, tileRow] of Object.entries(tileGroup)) {
      moveTileRow(tileRow, direction);
    }

    if (!_.isEqual(cloneTiles, tiles)) {
      pushTile(getTile())
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
  bind:this={gameContainer}
>
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
