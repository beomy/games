<script lang="ts">
  import GameCard from '@/components/GameCard.svelte'

  interface GameSummary {
    link: String;
    image: String;
    text: String;
  }

  let games: Array<GameSummary> = [{
    link: '#/2048Game',
    image: '/images/2048_logo.png',
    text: '2048'
  }, {
    link: '/',
    image: '/images/logo.png',
    text: 'TEST'
  }, {
    link: '/',
    image: '/images/logo.png',
    text: 'TEST'
  }, {
    link: '/',
    image: '/images/logo.png',
    text: 'TEST'
  }, {
    link: '/',
    image: '/images/logo.png',
    text: 'TEST'
  }, {
    link: '/',
    image: '/images/logo.png',
    text: 'TEST'
  }, {
    link: '/',
    image: '/images/logo.png',
    text: 'TEST'
  }];
</script>

<style lang="scss">
</style>

{#each games as game, i (i)}
  <GameCard {game} />
{/each}