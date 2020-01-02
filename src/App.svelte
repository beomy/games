<script lang="ts">
	import Router from 'svelte-spa-router'
	import { routes } from '@/routes'
	import Header from '@/components/Header.svelte'
</script>

<style lang="scss">
	@import "./assets/sass/variables.scss";

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
		<Header />
	</div>
	<div class="contents">
		<Router {routes}/>
	</div>
</div>
