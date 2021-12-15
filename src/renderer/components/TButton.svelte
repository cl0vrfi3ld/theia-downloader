<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let isActive: boolean;
</script>

<button
  class="rounded-[10px] px-3 py-2 t_btn bg-action"
  on:click={() => {
    dispatch("click");
  }}
>
  <span class="items-center content-center text-center"> <slot /> </span>
</button>

<style lang="sass">
    .t_btn
        color: #ffffff
        min-width: 4.3em
        min-height: 2.8em
</style>
