<script lang="ts">
	import type { Path } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { locales, localizeHref } from '#lib/paraglide/runtime.js';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';
	import '#lib/styles/global.css';
	import '@fontsource-variable/montserrat';
	import '@fontsource-variable/playfair-display';
	import Navigation from '#lib/components/Navigation.svelte';
	import Logo from '#lib/components/Logo.svelte';

	import { setContext } from 'svelte';

	import {
		navigationIntroKey,
		type NavigationIntroState
	} from '#lib/motion/navigation/context.ts';

	const navigationIntro = $state<NavigationIntroState>({
		opacity: 0,
		logoVisible: false,
		heroVisible: true
	});

	setContext(navigationIntroKey, navigationIntro);

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<Logo />

<Navigation />

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Path)}>{locale}</a>
	{/each}
</div>
