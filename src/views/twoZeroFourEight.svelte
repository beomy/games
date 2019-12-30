<script lang="ts">
  interface Point {
    x: Number,
    y: Number,
  }
  interface ITile {
    number: Number;
    point: Point;
    score: Number;
  }
  class Tile implements ITile {
    number: Number;
    point: Point;
    score: Number;

    constructor (number: number, point: Point) {
      this.number = number;
      this.point = point;
      this.score = 0;
    }

    getPos (): Point {
      return this.point;
    }
    setPos (point: Point): void {
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

  const gridCount: Array<Number> = [ 1, 2, 3, 4 ];
  let tile: Array<Tile> = [];
</script>

<style lang="scss">
  .game-container {
    position: relative;
    padding: 15px;
    touch-action: none;
    background: #bbada0;
    border-radius: 6px;
    width: 500px;
    height: 500px;
    box-sizing: border-box;
    margin: auto;
  }
  .grid-container {
    position: absolute;
    z-index: 1;
  }
  .grid-row {
    margin-bottom: 15px;
    overflow: hidden;
  }
  .grid-cell {
    width: 106.25px;
    height: 106.25px;
    margin-right: 15px;
    float: left;
    border-radius: 3px;
    background: rgba(238, 228, 218, 0.35);
  }
</style>

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

  </div>
</div>
