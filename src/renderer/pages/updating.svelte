<script lang="ts">
  import { getContext, onMount } from "svelte";

  let context: AppContext = getContext("AppContext");

  $: isDemo = false;

  onMount(() => {
    isDemo =
      new URLSearchParams(location.search).get("demo") == "1" ? true : false;
    console.log(isDemo);

    context.setBg(7); // TODO: make bg continually spin to indicate progress
  });
</script>

<div class="h-full w-screen absolute top-0">
  <div
    class="flex flex-col w-full h-full text-white justify-evenly items-center"
  >
    <h1 class="text-center text-4xl w-full">updating...</h1>

    <div class="">
      <img
        src="updating_icon.png"
        alt="Theia App Updating Icon"
        class=" h-32"
      />
    </div>

    <h2 class="text-xl text-center w-full">we'll be right back.</h2>
  </div>
</div>
