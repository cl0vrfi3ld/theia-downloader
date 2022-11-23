<script>
  import Download from "./pages/download.svelte";
  import Home from "./pages/index.svelte";
  import Setup from "./pages/setup.svelte";
  // import Login from "./pages/login.svelte";
  // import ApiController from "./components/APIController.svelte";
  import Router, { push } from "svelte-spa-router";
  import { setContext } from "svelte";

  import { onMount } from "svelte";

  const isDev = IS_DEV;
  const pageEnv = DEV_PAGE;
  let bgState = 1;
  //process.env.NODE_ENV === "development" &&
  onMount(() => {
    console.log(isDev);
    console.log(pageEnv);
    // if (isDev) localStorage.clear();
    if (pageEnv) push(`/${pageEnv}`);
  });

  const routes = {
    "/": Home,
    "/download/:justSetup?": Download,
    "/setup": Setup,
    // "/login": Login,
  };

  // $: selectedBg = bgState
  setContext("AppContext", {
    setBg: (n) => (bgState = n),
  });
</script>

<main class={`bg-main-grad h-screen bg_${bgState}`}>
  <div class="w-screen h-[29px] bg-black" style=" -webkit-app-region: drag;">
    <span class="h-full flex items-center text-white font-[system-ui] text-sm"
      ><img
        src="icon.png"
        alt="Theia App Icon"
        class="h-[24px] px-[4px] py-0"
      /><span>Theia</span></span
    >
  </div>

  <Router {routes} />

  <div class="w-screen h-[26px] absolute bottom-0" />
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  @property --a {
    syntax: "<angle>";
    inherits: false;
    initial-value: 10deg;
  }
  @property --hex1 {
    syntax: "<color>";
    inherits: false;
    initial-value: #000;
  }
  @property --p1 {
    syntax: "<percentage>";
    inherits: false;
    initial-value: 5%;
  }
  @property --hex2 {
    syntax: "<color>";
    inherits: false;
    initial-value: #fff;
  }
  @property --p2 {
    syntax: "<percentage>";
    inherits: false;
    initial-value: 80%;
  }

  body {
    margin: 0px;
    padding: 0px;
    position: absolute;
  }

  .bg-main-grad {
    position: absolute;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(
      var(--a),
      var(--hex1) var(--p1),
      var(--hex2) var(--p2)
    );
    transition: --a 1.5s, --hex1 0.7s, --hex2 0.7s, --p1 1s, --p2 1s;
    transition-timing-function: cubic-bezier(0.445, 0.05, 0.55, 0.95);
    overflow: hidden;
    margin: 0;
    padding: 0;
  }

  .bg_1 {
    --a: 120deg;
    --hex1: #023e58;
    --p1: 5%;
    --hex2: #000000;
    --p2: 87%;
  }

  .bg_2 {
    --a: 230.19deg;
    --hex1: #035578;
    --p1: -0.51%;
    --hex2: #000000;
    --p2: 96.28%;
  }

  .bg_3 {
    --a: 175deg;
    --hex1: #700458;
    --p1: 6%;
    --hex2: #000000;
    --p2: 100%;
  }

  .bg_4 {
    --a: 230.19deg;
    --hex1: #035578;
    --p1: -0.51%;
    --hex2: #000000;
    --p2: 96.28%;
  }

  .bg_5 {
    --a: 315.3deg;
    --hex1: #0c61ae;
    --p1: -29.31%;
    --hex2: #000000;
    --p2: 104.85%;
  }

  .bg_6 {
    --a: 227.03deg;
    --hex1: #0c61ae;
    --p1: -38.05%;
    --hex2: #000000;
    --p2: 126.08%;
  }
  /*.theia-btn {
    @apply;
  }*/
</style>
