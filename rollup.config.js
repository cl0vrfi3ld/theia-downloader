import sveltePreprocess from 'svelte-preprocess';

import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import autoprefixer from 'autoprefixer';
import dotenv from 'dotenv';
// import postcssrc from "postcss-load-config";
import css from 'rollup-plugin-css-only';
// import postcss from "rollup-plugin-postcss";
import del from 'rollup-plugin-delete';
import livereload from 'rollup-plugin-livereload';
import sass from 'rollup-plugin-sass';
import svelte from 'rollup-plugin-svelte';
import tailwind from 'tailwindcss';

dotenv.config();

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		async writeBundle() {
			if (server) return;
			server = (await import('child_process')).spawn('yarn', ['start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/renderer/main.ts',
	output: {
		sourcemap: true,
		format: 'es',
		name: 'app',
		dir: 'src/renderer/public/compiledjs'
	},
	plugins: [
		// postcssrc(),

		svelte({
			preprocess: sveltePreprocess({
				sourceMap: !production,
				postcss: { plugins: [autoprefixer, tailwind] },
				sass: {
					prependData: `@import 'src/renderer/public/vars.sass'`
				},

				replace: [
					['IS_DEV', !production],
					['DEV_PAGE', JSON.stringify(process.env.DEV_PAGE ? process.env.DEV_PAGE : null)],
					['ENV_VERSION', process.env.VERSION ? process.env.VERSION : 'Unknown']
				] // style: "postcss",
			}),

			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			},

			include: ['src/renderer/**/*.svelte', 'node_modules/svelte-spa-router/*.svelte']
		}),

		// postcss({ extract: "src/renderer/public/build/bundle.css" }),

		sass({ output: 'src/renderer/public/build/sass-out.css' }),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte'],
			preferBuiltins: false
		}),
		commonjs(),
		typescript({
			sourceMap: !production,
			inlineSources: !production
		}),
		json(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('src/renderer/public'),

		// clear dist cache before building
		production && del({ targets: 'src/renderer/public/compiledjs/*' }),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false,
		exclude: 'src/renderer/public/build'
	}
};
