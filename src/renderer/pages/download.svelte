<script>
	import Downloader from '../components/Downloader.svelte';
	import sample from 'lodash/sample';
	import { push } from 'svelte-spa-router';
	import { getContext, onMount } from 'svelte';

	export let params = {};

	let context = getContext('AppContext');

	onMount(() => {
		context.setBg(sample([1, 4, 5, 6]));
	});
</script>

<div class="h-full w-screen">
	<h1 class=" absolute top-24 mr-2 w-full text-center text-4xl text-white">
		{#await window.ipc.invoke('get_quips') then quips}
			{params.justSetup ? 'download' : sample(quips)}
		{/await}
	</h1>
	<div class="flex h-full flex-col items-center justify-center align-middle">
		<Downloader />
	</div>
	<button
		class="absolute bottom-2 left-1/2 z-10 -translate-x-1/2 text-white"
		on:click|once={() => push('/setup')}>change folder</button
	>
</div>
