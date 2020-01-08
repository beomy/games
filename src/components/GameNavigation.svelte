<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function prevCancel (event): void {
    dispatch('prevCancel')
  }

  function newGame (): void {
    dispatch('newGame')
  }
</script>

<style lang="scss">
  .navigation-buttons {
    overflow: hidden;
  }
  .new-game {
    background: #8f7a66;
    border-radius: 3px;
    padding: 0 20px;
    text-decoration: none;
    color: #f9f6f2;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-weight: bolder;
    margin: 0;
    cursor: pointer;
  }
  .undo {
    width: 35px;
    height: 35px;
    position: relative;
    top: 10px;
    right: 5px;
    display: inline-block;
    cursor: pointer;
  }
</style>

<div class="navigation-buttons">
  <div
    class="undo"
    on:click={prevCancel}
  >
    <img src="/images/undo.svg" alt="실행취소">
  </div>
  <button
    type="button"
    class="new-game"
    on:click={newGame}
  >
    New Game
  </button>
</div>
