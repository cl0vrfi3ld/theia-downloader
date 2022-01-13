<script>
  /** @type {import("musickit-js")} */
  import { setContext } from "svelte";

  // MusicKit Integration
  let loadMusicKit = false;
  let musicKitLoaded = false;
  let musicKitAuthd = false;
  let musicKitInstance;
  const mkt = MUSICKIT_TOKEN;
  // let MusicKit = window.MusicKit

  document.addEventListener("musickitloaded", () => {
    console.log("music kit is ready");
    // console.log(MUSICKIT_TOKEN);
    musicKitLoaded = true;

    MusicKit.configure({
      developerToken: mkt,
      app: {
        name: "Theia",
        build: IS_DEV ? "Dev" : ENV_VERSION,
      },
    });
    musicKitInstance = MusicKit.getInstance();

    // lets try logging in
    musicKitInstance
      .authorize()
      .then(() => {
        console.log("authorized");
        musicKitAuthd = true;
      })
      .catch((err) => console.error(err));
  });

  setContext("APIWrapper", {
    AppleMusic: {
      load: () => {
        loadMusicKit = true;
      },
      auth: () => {
        if (!musicKitLoaded) {
          loadMusicKit = true;
          return "attempting music kit load, call function again";
        }
      },
      getSdk: () => {
        return musicKitInstance;
      },
    },
  });
</script>

<slot />

<svelte:head>
  {#if loadMusicKit}
    <script
      src="https://js-cdn.music.apple.com/musickit/v1/musickit.js"></script>
  {/if}
</svelte:head>
