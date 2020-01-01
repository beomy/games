<script lang="ts">
  import { number } from '@/utils'
  import TitleCell from '@/components/twoZeroFourEight/Tile.svelte'

  interface IPoint {
    x: Number,
    y: Number,
  }
  interface ITile {
    number: Number;
    point: IPoint;
    score: Number;
  }
  class Tile implements ITile {
    number: Number;
    point: IPoint;
    score: Number;

    constructor (number: number, point: IPoint) {
      this.number = number;
      this.point = point;
      this.score = 0;
    }

    getPos (): IPoint {
      return this.point;
    }
    setPos (point: IPoint): void {
      this.point = point;
    }

    getNumber (): Number {
      return this.number;
    }
    setNumber (number: Number): void {
      this.number = number;
    }

    getScore (): Number {
      return this.score;
    }
  }

  const rowCount = 4
  const remainPoint: Array<String> = []
  const gridCount: Array<Number> = [];
  
  (function init (): void {
    for (let i = 1; i <= rowCount; i++) {
      for (let j = 1; j <= rowCount; j++) {
        remainPoint.push(`${i},${j}`)
      }
      gridCount.push(i)
    }
  })()

  function popRemainPoint (): IPoint {
    const index = number.random(0, remainPoint.length - 1)
    const item = remainPoint.splice(index, 1).pop()
    return {
      x: Number(item.split(',')[0]),
      y: Number(item.split(',')[1])
    }
  }

  function getTile (): Tile {
    return new Tile(2, popRemainPoint())
  }

  function handleKeydown ({ keyCode }) {
    console.log(keyCode)
  }

  let tiles: Array<Tile> = [
    getTile(),
    getTile()
  ];
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
    {#each tiles as tile}
      <TitleCell {tile} />
    {/each}
  </div>
</div>
