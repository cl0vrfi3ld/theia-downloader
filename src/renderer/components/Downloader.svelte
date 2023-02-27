<script lang="ts">
  import type { IpcRenderer } from "electron";
  import { onMount, getContext } from "svelte";
  import TButton from "./TButton.svelte";

  import { auth, gun, user } from "../util/svelte-gun";

  // console.log(Store.);

  // type bridgedIpcRenderer = Override<IpcRenderer, >

  const ipcRenderer: IpcRenderer = window.ipc;
  let context: AppContext = getContext("AppContext");
  let isDev = IS_DEV; // dynamically inserted variable from rollup
  let url: string;
  let path = "";
  let status: string = "download";
  let progress: number = 0;
  let format: string = "flac";
  let fidelity: string = "highest";
  let dlbtnDisabled = false;

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

    dlbtnDisabled = true;
    status = "downloading...";

    ipcRenderer.send("start_download", {
      url,
      dirPath: path,
      container: format,
      quality: fidelity,
    });
  };

  const doDebugShow = async () => {
    console.log("attempted to invoke update window preview");
    await ipcRenderer.invoke("show_update_window");
  };
  /*ipcRenderer.on("save_dir_selected", (arg) => {
    console.log(arg);
    path = arg[0];
  });*/
  ipcRenderer.on("download_finished", (arg: object) => {
    if (arg.success) {
      status = "finished";
      progress = 0;

      setTimeout(() => {
        status = "download";
        dlbtnDisabled = false;
      }, 1000);
    } else {
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
      class="bg-action text-white placeholder-white rounded-2xl mb-[12px] h-8 text-center py-2 px-3"
    />
    <div class="mb-[12px] mx-[54px]">
      <TButton
        on:click={() => (format = "mp3")}
        isActive={Boolean(format === "mp3")}>mp3</TButton
      >
      <TButton
        on:click={() => (format = "flac")}
        isActive={Boolean(format === "flac")}>flac</TButton
      >
      <TButton
        on:click={() => (format = "wav")}
        isActive={Boolean(format === "wav")}
        tooltip="coming very, very soon!"
        disabled={true}>wav</TButton
      >
    </div>
    <div class="mb-[12px] mx-[54px]">
      <TButton
        on:click={() => (fidelity = "lowest")}
        isActive={Boolean(fidelity === "lowest")}>lo-fi</TButton
      >
      <TButton
        on:click={() => (fidelity = "medium")}
        isActive={Boolean(fidelity === "medium")}>mid-fi</TButton
      >
      <TButton
        on:click={() => (fidelity = "highest")}
        isActive={Boolean(fidelity === "highest")}>hi-fi</TButton
      >
    </div>

    <TButton on:click={doDownload} {progress} wide disabled={dlbtnDisabled}
      >{status}</TButton
    >
    <br />
  </form>
  {#if isDev}
    <div>
      <h2>status: {status}</h2>
      <h2>progress: {progress}%</h2>
      <h2>path: {path}</h2>

      <TButton
        disabled={false}
        on:click={() => {
          user.get("preferences").get("save_dir").put(null);
        }}>clear dir</TButton
      >
      <TButton disabled={false} on:click={doDebugShow}
        >show update window</TButton
      >
    </div>
  {/if}
</div>

<style lang="sass">

</style>
