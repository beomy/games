<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function prevCancel (): void {
    dispatch('prevCancel')
  }

  function newGame (): void {
    dispatch('newGame')
  }
</script>

<style lang="scss">
</style>

<button
  type="button"
  on:click={prevCancel}
>
  실행 취소
</button>
<button
  type="button"
  on:click={newGame}
>
  New Game
</button>