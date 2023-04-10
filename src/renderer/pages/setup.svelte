<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { push } from 'svelte-spa-router';

	import type { IpcRenderer } from 'electron';

	import TButton from '../components/TButton.svelte';
	import { user } from '../util/svelte-gun';

	const ipcRenderer: IpcRenderer = window.ipc;
	let context: AppContext = getContext('AppContext');

	onMount(() => {
		setTimeout(() => context.setBg(2), 100);
	});
</script>

<div class="h-full w-screen">
	<h1 class=" absolute top-24 w-full text-center text-4xl text-white">
		where should i put your music?
	</h1>
	<div class="flex h-full flex-col items-center justify-center justify-evenly align-middle">
		<TButton
			on:click={async () => {
				// console.log("clicked");
				// path = await
				context.setBg(3);
				ipcRenderer.invoke('get_save_dir').then((res) => {
					console.log(res);
					if (!res) return;
					//  path = res;
					user
						.get('preferences')
						.get('save_dir')
						.put(res, () => push('/download/true'));
				});
			}}>select folder</TButton
		>
	</div>
</div>
