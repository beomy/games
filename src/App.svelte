<script lang="typescript">
	import Router from 'svelte-spa-router'
	import { routes } from './routes'
	import Header from './components/Header.svelte'

	export let name: string;

	let test: string = 'wow';
</script>

<style lang="scss" global>
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
	<Header />
	<div class="contents">
		{name}
		<Router {routes}/>
	</div>
</div>
