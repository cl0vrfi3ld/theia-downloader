<script lang="ts">
  import type { IpcRenderer } from "electron";
  import { getContext, onMount } from "svelte";
  import Router, { push } from "svelte-spa-router";
  // this component is basically gonna be our "catchall" page on startup

  const ipcRenderer: IpcRenderer = window.ipc;

  let context: AppContext = getContext("AppContext");

  onMount(() => {
    ipcRenderer
      .invoke("store_get", { query: "saveDir" })
      .then((res) => {
        if (res && !DEV_PAGE) push("/download");
        else if (DEV_PAGE) return;
        else push("/setup");
      })
      .catch((err) => {
        console.error(err);
      });
  });
</script>

<button on:click={() => context.setBg(2)}>bg</button>
