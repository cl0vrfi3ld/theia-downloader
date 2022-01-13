<script>
  import { getContext } from "svelte";

  let APIWrapper = getContext("APIWrapper");
</script>

<div>
  <button on:click={() => APIWrapper.AppleMusic.load()}>apple</button>
</div>
