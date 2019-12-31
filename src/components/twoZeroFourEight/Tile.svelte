<script lang="ts">
  export let tile;

  $: point = tile.point
</script>

<style lang="scss">
  $size: 121;
  @for $i from 1 to 5 {
    @for $j from 1 to 5 {
      .position-#{$i}-#{$j} {
        transform: translate(#{($i - 1) * $size}px, #{($j - 1) * $size}px);
      }
    }
  }

  .tile {
    position: absolute;
    transition: 100ms ease-in-out;
    transition-property: transform;
    width: 107px;
    height: 107px;
    line-height: 116.25px;
  }

  .tile-inner {
    background: #eee4da;
    line-height: 107px;
    border-radius: 3px;
    text-align: center;
    font-weight: bold;
    z-index: 10;
    font-size: 55px;
    color: #776e65;
  }
</style>

<div class="tile tile-{tile.number} position-{point.x}-{point.y}">
  <div class="tile-inner">{tile.number}</div>
</div>