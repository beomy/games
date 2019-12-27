<script lang="typescript">
	export let name: string;
	let test: string = 'wow';
</script>

<style lang="scss">
$xs: 0;
$sm: 576px;
$md: 768px;
$lg: 992px;
$xl: 1200px;

@media (min-width: $xl) {
	.header {
		width: $xl;
		margin: auto;
	}
	.contents {
		width: $xl;
		margin: auto;
	}
}
</style>

<div class="warp">
	<div class="header">
		beomy games
	</div>
	<div class="contents">
		{name}
		{test}
	</div>
</div>
