<script lang="ts">
  import type { IpcRenderer } from "electron";
  // import { log } from "gun/gun";
  import { getContext, onMount } from "svelte";
  import Router, { push } from "svelte-spa-router";
  import { auth, user } from "../util/svelte-gun";
  // this component is basically gonna be our "catchall" page on startup

  const ipcRenderer: IpcRenderer = window.ipc;

  let context: AppContext = getContext("AppContext");
  const pageEnv = DEV_PAGE;

  onMount(async () => {
    // console.log("mounted, awaiting auth");

    await auth();

    // console.log("authd");

    user
      .get("preferences")
      .get("save_dir")
      .once((i) => {
        console.log(i, pageEnv);

        if (pageEnv) {
          // console.log("pushing to DEV_PAGE");
          return;
        }

        // if (!pageEnv) console.log("no DEV_PAGE");

        if (i) {
          // console.log("pushing to download");
          push("/download");
          return;
        } else {
          // console.log("pushing to setup");
          push("/setup");
          return;
        }
      });
  });
</script>

<!-- <button on:click={() => context.setBg(2)}>bg</button> -->
