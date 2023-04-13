<script lang="ts">
	// this component is basically gonna be our "catchall" page on startup

	import { getContext, onMount } from 'svelte';
	import Router, { push } from 'svelte-spa-router';

	import type { IpcRenderer } from 'electron';

	import { auth, user } from '../util/svelte-gun';

	const pageEnv = DEV_PAGE;

	onMount(async () => {
		await auth();

		user
			.get('preferences')
			.get('save_dir')
			.once((i) => {
				console.log(i, pageEnv);

				if (pageEnv) {
					// console.log("pushing to DEV_PAGE");
					return;
				}

				// if (!pageEnv) console.log("no DEV_PAGE");

				if (i) {
					// console.log("pushing to download");
					push('/download');
					return;
				} else {
					// console.log("pushing to setup");
					push('/setup');
					return;
				}
			});
	});
</script>
