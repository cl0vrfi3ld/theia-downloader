import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
/*export default defineConfig({
	plugins: [svelte()],
	root: "./src-ui"
});*/

import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// import { svelte } from '@sveltejs/vite-plugin-svelte';
import autoprefixer from 'autoprefixer';
import tailwind from 'tailwindcss';
// import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
	const production = (command === 'serve');
	return {
		root: "./src-ui",
		define: {
						IS_DEV: process.env.NODE_ENV === 'development' ? true : false,
						DEV_PAGE: process.env.DEV_PAGE ? process.env.DEV_PAGE : null,
						ENV_VERSION: process.env.VERSION ? process.env.VERSION : 'Unknown'
		},
		build: { outDir: './ui-out' },
		server: {
			port: 9874,
			strictPort: true
		},
		css:{
			transformer:"postcss",
			postcss:{
				plugins: [
					autoprefixer, tailwind,
				]
			}
		},
		cacheDir: "src-ui/ui-cache",
		plugins: [
			svelte({
				preprocess: vitePreprocess({
					//sourceMap: !production,
					// postcss: { plugins: [autoprefixer, tailwind] },
					/* sass: {
					prependData: `@import 'src/renderer/public/vars.sass'`
				}, */
					
				}),
				compilerOptions: {
					// enable run-time checks when not in production
					dev: !production
				},
				include: ['src/renderer/**/*.svelte', 'node_modules/svelte-spa-router/*.svelte']
			}),
			checker({
				typescript: true
			})
		]
	};
});