<script lang="ts">
  import GameCard from '@/components/GameCard.svelte'

  let games: Array<Object> = [{
    link: '#/2048Game',
    image: '/images/2048_logo.png',
    text: '2048'
  }];
</script>

{#each games as game, i (i)}
  <GameCard {game} />
{/each}