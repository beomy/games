<script>
	export let name;
</script>

<style lang="scss">
	.warp {
		.contents {
			width: 1080px;
			margin: auto;
			p {
				font-size: 20px;
			}
		}
	}
</style>

<div class="warp">
	<div class="header"></div>
	<div class="contents">
		{name}
		<p>TTT</p>
	</div>
</div>
