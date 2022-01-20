<script>
  import Downloader from "../components/Downloader.svelte";
  import sample from "lodash/sample";
  import { push } from "svelte-spa-router";

  const headers = [
    "go wild",
    "don't worry, i won't snitch",
    "jammin'",
    "bleep bloop",
  ];

  export let params = {};
</script>

<div class="h-full w-screen">
  <h1 class=" top-24 absolute text-center text-white text-4xl w-full">
    {params.justSetup ? "download" : sample(headers)}
  </h1>
  <div
    class="flex flex-col items-center justify-center align-middle justify-evenly h-full"
  >
    <Downloader />
  </div>
  <button
    class="text-white absolute bottom-2 left-1/2 -translate-x-1/2 z-10"
    on:click|once={() => push("/setup")}>change folder</button
  >
</div>
