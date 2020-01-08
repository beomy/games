<script lang="ts">
  import { fade } from 'svelte/transition';
  import { Tile } from '@/@types'

  export let tile: Tile;

  $: point = { x: tile.point.x, y: tile.point.y }
</script>

<style lang="scss">
  @import "../../assets/sass/variables.scss";
  @import "../../assets/sass/variables_2048.scss";

  @for $i from 1 to 5 {
    @for $j from 1 to 5 {
      .position-#{$i}-#{$j} {
        transform: translate(#{($i - 1) * $move}, #{($j - 1) * $move});
      }
    }
  }

  .tile {
    position: absolute;
    transition: 100ms ease-in-out;
    transition-property: transform;
    width: ceil($cell);
    height: ceil($cell);
    line-height: ceil($cell);
  }

  .merged {
    z-index: -1;
  }

  .tile-inner {
    background: #eee4da;
    line-height: ceil($cell);
    border-radius: 3px;
    text-align: center;
    font-weight: bold;
    z-index: 10;
    font-size: $font;
    color: #776e65;
  }

  .tile-4 .tile-inner { background: #ede0c8; }
  .tile-8 .tile-inner { background: #f2b179; color: #f9f6f2; }
  .tile-16 .tile-inner { background: #f59563; color: #f9f6f2; }
  .tile-32 .tile-inner { background: #f67c5f; color: #f9f6f2; }
  .tile-64 .tile-inner { background: #f65e3b; color: #f9f6f2; }

  @media (max-width: $sm) {
    .tile {
      width: $smCell;
      height: $smCell;
      line-height: $smCell;
    }
    .tile-inner {
      line-height: $smCell;
      font-size: $smFont;
    }
    @for $i from 1 to 5 {
      @for $j from 1 to 5 {
        .position-#{$i}-#{$j} {
          transform: translate(#{($i - 1) * $smMove}, #{($j - 1) * $smMove});
        }
      }
    }
  }
</style>

<div
  class="tile tile-{tile.number} position-{point.x}-{point.y} {tile.isDelete ? 'merged' : ''}"
  in:fade="{{ delay: 100, duration: 100 }}"
>
  <div class="tile-inner">{tile.number}</div>
</div>