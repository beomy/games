<script lang="ts">
  import { fade, fly } from 'svelte/transition';

  export let title: string;
  export let score: Number;
  export let best: Number;
  export let addition: Number;

  let visible = false;

  $: if (addition !== 0) (
    visible = true
  )
</script>

<style lang="scss">
  .score-container, .best-container {
    position: relative;
    display: inline-block;
    background: #bbada0;
    padding: 15px 25px;
    font-size: 25px;
    height: 40px;
    line-height: 40px;
    font-weight: bold;
    border-radius: 3px;
    color: white;
    margin-top: 8px;
    text-align: center;
  }
  .title {
    font-size: 13px;
    line-height: 13px;
    text-align: center;
    color: #eee4da;
  }
  .score {
    height: 35px;
    line-height: 30px;
  }
  .addition {
    position: absolute;
    right: 35px;
    z-index: 1;
    color: rgba(119, 110, 101, 0.9);
    top: 23px;
  }
  .game-title {
    display: inline-block;
    height: 80px;
    line-height: 80px;
    float: left;
    h1 {
      font-weight: bolder;
      font-size: 80px;
    }
  }
</style>

<div class="game-title">
  <h1>{title}</h1>
</div>
<div class="score-container">
  <div class="title">SCORE</div>
  <div class="score">{score}</div>
  {#if visible && addition !== 0}
    <div
      in:fade={{ duration: 100 }}
      out:fly="{{ y: -50, duration: 800 }}"
      on:introend="{() => visible = false}"
      class="addition"
    >
      +{addition}
    </div>
  {/if}
</div>
<div class="best-container">
  <div class="title">BEST</div>
  <div class="score">{best}</div>
</div>