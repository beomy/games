<script lang="ts">
  import GameCard from '@/components/GameCard.svelte'

  let games: Array<Object> = [{
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
  }, {
    link: '/',
    image: '/images/logo.png',
    text: 'TEST'
  }];
</script>

{#each games as game, i (i)}
  <GameCard {game} />
{/each}