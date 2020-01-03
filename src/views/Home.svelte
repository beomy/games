<script lang="ts">
  import GameCard from '@/components/GameCard.svelte'

  interface GameSummary {
    link: String;
    image: String;
    text: String;
  }

  let games: Array<GameSummary> = [{
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
