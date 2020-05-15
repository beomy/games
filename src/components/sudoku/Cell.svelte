<script lang="ts">
  export let cell: SudokuCell;
</script>

<div class="cell">
  <div class="value">{cell.value === 0 ? '' : cell.value}</div>
  <div class="candidate">
    <div class="candidate-row">
        <div class="candidate-item" class:active={cell.candidateValues.includes(1)}>1</div>
        <div class="candidate-item" class:active={cell.candidateValues.includes(2)}>2</div>
        <div class="candidate-item" class:active={cell.candidateValues.includes(3)}>3</div>
    </div>
    <div class="candidate-row">
        <div class="candidate-item" class:active={cell.candidateValues.includes(4)}>4</div>
        <div class="candidate-item" class:active={cell.candidateValues.includes(5)}>5</div>
        <div class="candidate-item" class:active={cell.candidateValues.includes(6)}>6</div>
    </div>
    <div class="candidate-row">
        <div class="candidate-item" class:active={cell.candidateValues.includes(7)}>7</div>
        <div class="candidate-item" class:active={cell.candidateValues.includes(8)}>8</div>
        <div class="candidate-item" class:active={cell.candidateValues.includes(9)}>9</div>
    </div>
  </div>
</div>

<style lang="scss">
  .cell {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 60px;
  }
  .value {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    text-align: center;
    font-size: 35px;
    &:before {
      content: '';
      display: inline-block;
      height: 100%;
      vertical-align: middle;
    }
  }
  .candidate {
    height: 100%;
  }
  .candidate-row {
    height: 33.3333%;
    .candidate-item {
      float: left;
      width: 33.3333%;
      height: 100%;
      text-align: center;
      &:before {
        content: '';
        display: inline-block;
        height: 100%;
        vertical-align: middle;
      }
    }
  }
</style>
