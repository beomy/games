<script lang="ts">
	import Router from 'svelte-spa-router'
	import { routes } from '@/routes'
	import Header from '@/components/Header.svelte'

	let test: string = 'wow';
</script>

<style lang="scss">
	@import "./assets/sass/variables.scss";

	@media (min-width: $xl) {
		.contents {
			width: $xl;
			margin: auto;
		}
	}
</style>

<div class="warp">
	<Header />
	<div class="contents">
		<Router {routes}/>
	</div>
</div>
