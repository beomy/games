<script lang="ts">
  export let game: Object
</script>

<style lang="scss">
	@import "../assets/sass/variables.scss";

	@media (min-width: $xl) {
    .game-link {
      display: inline-block;
      width: 20%;
      margin-bottom: 20px;
    }
  }
  .game-info {
    margin-right: 20px;
  }
  img {
    width: 100%;
  }
</style>

<a class="game-link" href={game.link}>
  <div class="game-info">
    <div class="image-area">
      <img src={game.image} alt="게임 이미지" />
    </div>
    <div class="text-area">{game.text}</div>
  </div>
</a>