<script lang="ts">
  import type { IpcRenderer } from "electron";
  import { onMount } from "svelte";
  import TButton from "./TButton.svelte";

  // console.log(Store.);

  // type bridgedIpcRenderer = Override<IpcRenderer, >

  const ipcRenderer: IpcRenderer = window.ipc;
  let url: string;
  let path: string;
  let status: string = "waiting";
  let progress: number = 0;
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

  onMount(() => {
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

<div class="align-center text-white flex flex-col items-center content-center">
  <h1 class="text-2xl">download!</h1>
  <form
    on:submit|preventDefault={doDownload}
    class="flex flex-col items-center content-center"
  >
    <br />
    <input
      type="text"
      bind:value={url}
      placeholder="youtube url"
      class="text-black placeholder-gray-600"
    />

    <br />

    <button type="submit">download</button>
  </form>
  <h2>status: {status}</h2>
  <h2>progress: {progress}%</h2>
  <h2>path: {path}</h2>
  <TButton on:click={doDownload}>download</TButton>
  <br />
  <TButton on:click={doDownload}>lofi</TButton>
  <br />
  <TButton on:click={doDownload}>hifi</TButton>
  <br />
  <button
    type="file"
    on:click|preventDefault={async () => {
      // console.log("clicked");
      // path = await
      ipcRenderer.invoke("get_save_dir").then((res) => {
        console.log(res);
        if (!res) return;
        path = res;
        ipcRenderer.invoke("store_set", { query: "saveDir", data: path });
      });
    }}>pick your downloads folder</button
  >
  <button
    on:click={() => {
      ipcRenderer.invoke("clear_save_dir").then((res) => {
        path = "";
      });
    }}>clear dir</button
  >
</div>

<style lang="sass">

</style>
