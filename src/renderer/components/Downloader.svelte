<script lang="ts">
  import type { IpcRenderer } from "electron";
  import { onMount, getContext } from "svelte";
  import TButton from "./TButton.svelte";

  import { auth, gun, user } from "../util/svelte-gun";

  // console.log(Store.);

  // type bridgedIpcRenderer = Override<IpcRenderer, >

  const ipcRenderer: IpcRenderer = window.ipc;
  let context: AppContext = getContext("AppContext");
  let isDev = IS_DEV;
  let url: string;
  let path: string;
  let status: string = "waiting";
  let progress: number = 0;
  let format = 1;
  let fidelity = 2;

  const doDownload = () => {
    if (!url) {
      ipcRenderer.send("alert", {
        title: "heads up",
        message: "please input a url",
      });
      return;
    }
    if (!path) {
      ipcRenderer.send("alert", {
        title: "heads up",
        message: "please choose a place to save your music",
      });
      return;
    }
    status = "downloading...";
    ipcRenderer.send("start_download", {
      url,
      dirPath: path,
      fileName: "test1",
    });
  };
  /*ipcRenderer.on("save_dir_selected", (arg) => {
    console.log(arg);
    path = arg[0];
  });*/
  ipcRenderer.on("download_finished", (arg: object) => {
    if (arg.success) status = "finished";
    else {
      status = "error";
      console.log(arg.err);
    }
  });

  ipcRenderer.on("progress_update", (arg: number) => {
    progress = arg;
  });

  onMount(async () => {
    context.setBg(1);

    if (!user.is) await auth();

    user
      .get("preferences")
      .get("save_dir")
      .on((i) => {
        path = i;
        path = path;
      });
    /*
    ipcRenderer
      .invoke("store_get", { query: "saveDir" })
      .then((res) => {
        path = res;
      })
      .catch((err) => {
        console.error(err);
      }); */
  });
</script>

<div class="align-center text-white flex flex-col items-center content-center ">
  <form
    on:submit|preventDefault={doDownload}
    class="flex flex-col items-center content-center"
  >
    <input
      type="text"
      bind:value={url}
      placeholder="youtube url"
      class="bg-action text-white placeholder-white rounded-2xl mb-[12px] h-8 text-center p-2"
    />
    <div class="mb-[12px] mx-[54px]">
      <TButton on:click={() => (format = 0)} isActive={Boolean(format === 0)}
        >mp3</TButton
      >
      <TButton on:click={() => (format = 1)} isActive={Boolean(format === 1)}
        >flac</TButton
      >
      <TButton on:click={() => (format = 2)} isActive={Boolean(format === 2)}
        >wav</TButton
      >
    </div>
    <div class="mb-[12px] mx-[54px]">
      <TButton
        on:click={() => (fidelity = 0)}
        isActive={Boolean(fidelity === 0)}>lo-fi</TButton
      >
      <TButton
        on:click={() => (fidelity = 1)}
        isActive={Boolean(fidelity === 1)}>mid-fi</TButton
      >
      <TButton
        on:click={() => (fidelity = 2)}
        isActive={Boolean(fidelity === 2)}>hi-fi</TButton
      >
    </div>

    <TButton on:click={doDownload}>download</TButton>
    <br />
  </form>
  <h2>status: {status}</h2>
  <h2>progress: {progress}%</h2>
  <h2>path: {path}</h2>
  {#if isDev}
    <button
      on:click={() => {
        user.get("preferences").get("save_dir").put(null);
      }}>clear dir</button
    >
  {/if}
</div>

<style lang="sass">

</style>
