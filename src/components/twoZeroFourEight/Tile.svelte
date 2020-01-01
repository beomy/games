<script lang="ts">
  export let tile;

  $: point = tile.point
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
    width: $cell;
    height: $cell;
    line-height: $cell;
  }

  .tile-inner {
    background: #eee4da;
    line-height: $cell;
    border-radius: 3px;
    text-align: center;
    font-weight: bold;
    z-index: 10;
    font-size: $font;
    color: #776e65;
  }

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

<div class="tile tile-{tile.number} position-{point.x}-{point.y}">
  <div class="tile-inner">{tile.number}</div>
</div>