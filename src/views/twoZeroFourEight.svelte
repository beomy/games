<script lang="ts">
  const gridCount: Array<Number> = [ 1, 2, 3, 4 ];
</script>

<style lang="scss">
  .game-container {
    position: relative;
    padding: 15px;
    cursor: default;
    touch-action: none;
    background: #bbada0;
    border-radius: 6px;
    width: 500px;
    height: 500px;
    box-sizing: border-box;
  }
  .grid-container {
    position: absolute;
    z-index: 1;
  }
  .grid-row {
    margin-bottom: 15px;
    &:after {
      content: "";
      display: block;
      clear: both;
    }
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
</div>
