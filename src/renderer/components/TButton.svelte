<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let isActive: boolean = false;
  export let type: string = "button";
</script>

<button
  {type}
  class={`${
    isActive ? "bg-white" : "bg-action"
  } rounded-[10px] px-3 py-2 t_btn`}
  on:click={() => {
    dispatch("click");
  }}
>
  <span
    class={`${
      isActive && "text-black"
    } items-center content-center text-center`}
  >
    <slot />
  </span>
</button>

<style lang="sass">
    .t_btn
        color: #ffffff
        min-width: 4.6em
        min-height: 2.7em
</style>
