<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let isActive: boolean = false;
  export let type: "button" | "submit" | "reset" = "button";
  export let wide: boolean = false;
  export let tooltip: string = "";
  export let disabled: boolean = false;
  export let progress: number = 0;
</script>

<button
  {disabled}
  {type}
  title={tooltip}
  style="--theme-fill: {progress}%"
  class={`
  ${isActive ? "bg-white" : "bg-action"} 
  ${wide && "wide"}
  ${disabled && "cursor-not-allowed"}
  rounded-[10px] px-3 py-2 t_btn`}
  on:click={() => {
    dispatch("click");
  }}
>
  <span
    class={`
      ${disabled && wide && "white-override"}
    ${disabled && "text-gray-400 cursor-not-allowed"}
    ${isActive && "text-black"} items-center content-center text-center ${
      progress && progress > 0 && "mix-blend-difference"
    }`}
  >
    <slot />
  </span>
</button>

<style lang="sass">
    .t_btn
      color: #ffffff
      min-width: 4.6em
      min-height: 2.7em
      position: relative
      overflow: hidden

    .t_btn:before 
      content: "\A"
      position: absolute
      background: white
      top: 0 
      bottom: 0
      left: 0
      width: var(--theme-fill)

    .white-override
      color: white !important

    .wide
      min-width: 7.6em !important
</style>
