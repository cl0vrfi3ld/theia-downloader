<script>
  import Downloader from "../components/Downloader.svelte";
  import sample from "lodash/sample";
  import { push } from "svelte-spa-router";
  import { getContext, onMount } from "svelte";

  let quips;

  export let params = {};

  let context = getContext("AppContext");

  /*  const getQuips = async () => {
    const gotQuips = await window.ipc.invoke("get_quips");
    return gotQuips;
  };  */

  onMount(() => {
    context.setBg(sample([1, 4, 5, 6]));
  });
</script>

<div class="h-full w-screen">
  <h1 class=" top-24 absolute text-center text-white text-4xl w-full">
    {#await window.ipc.invoke("get_quips") then quips}
      {params.justSetup ? "download" : sample(quips)}
    {/await}
  </h1>
  <div class="flex flex-col items-center justify-center align-middle h-full">
    <Downloader />
  </div>
  <button
    class="text-white absolute bottom-2 left-1/2 -translate-x-1/2 z-10"
    on:click|once={() => push("/setup")}>change folder</button
  >
</div>
