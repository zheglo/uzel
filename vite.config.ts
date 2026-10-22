import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import UnoCSS from '@unocss/svelte-scoped/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		UnoCSS(),

		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			adapter: adapter(),
			alias: {
				'~fonts': './src/lib/fonts',
				'~components': './src/components',
				'~routes': './src/routes',
				'~db': './src/server/db',
				'~lib': './src/lib',
				'~assets': './src/lib/assets',
				'~animations': './src/lib/animations'
			}
		})
	]
});
