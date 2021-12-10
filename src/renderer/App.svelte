<script lang="ts">
  import type { IpcRenderer } from "electron";

  const ipcRenderer: IpcRenderer = window.ipc;
  let url: string;
  let path: string;
  let status: string = "waiting";
  const doDownload = () => {
    if (!url) {
      ipcRenderer.send("alert", {
        title: "heads up",
        message: "please input a url",
      });
      return;
    }
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
</script>

<main>
  <h1>download</h1>
  <form on:submit|preventDefault={doDownload}>
    <input type="text" bind:value={url} placeholder="youtube url" />
    <br />
    <br />
    <input
      type="file"
      title="pick your downloads folder"
      on:click|preventDefault={async () => {
        console.log("clicked");
        // path = await
        ipcRenderer.invoke("get_save_dir").then((res) => {
          // console.log(res);
          path = res;
        });
      }}
    />
    <button type="submit">download</button>
  </form>
  <h2>status: {status}</h2>
  <h2>path: {path}</h2>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
