<script lang="ts">
  import TButton from "../components/TButton.svelte";

  import { getContext, onMount } from "svelte";
  import { user } from "../util/svelte-gun";
  import type { IpcRenderer } from "electron";
  import { push } from "svelte-spa-router";

  const ipcRenderer: IpcRenderer = window.ipc;
  let context: AppContext = getContext("AppContext");

  onMount(() => {
    setTimeout(() => context.setBg(2), 100);
  });
</script>

<div class="h-screen w-screen">
  <div
    class="flex flex-col items-center justify-center align-middle justify-evenly h-full"
  >
    <h1 class="mx-11 -mt-32 text-center text-white text-4xl">
      where should i put your music?
    </h1>
    <TButton
      on:click={async () => {
        // console.log("clicked");
        // path = await
        context.setBg(3);
        ipcRenderer.invoke("get_save_dir").then((res) => {
          console.log(res);
          if (!res) return;
          //  path = res;
          user
            .get("preferences")
            .get("save_dir")
            .put(res, () => push("/download"));
        });
      }}>select folder</TButton
    >
    <div class=" h-[26px]" />
  </div>
</div>
