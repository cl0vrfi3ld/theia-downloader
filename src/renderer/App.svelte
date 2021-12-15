<script>
  import Download from "./pages/download.svelte";
  import Home from "./pages/index.svelte";
  import Router, { push } from "svelte-spa-router";

  import { onMount } from "svelte";

  const isDev = IS_DEV;
  const pageEnv = DEV_PAGE;
  //process.env.NODE_ENV === "development" &&
  onMount(() => {
    console.log(isDev);
    console.log(pageEnv);
    if (pageEnv) push(`/${pageEnv}`);
  });

  const routes = {
    "/": Home,
    "/download": Download,
  };
</script>

<main class="bg-main-grad">
  <Router {routes} />
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  body {
    margin: 0px;
    padding: 0px;
    position: absolute;
  }
  /*
  .bg-main-grad {
    position: absolute;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(119.56deg, #023e58 4.83%, #000000 86.84%);
    margin: 0;
    padding: 0;
  }
  */

  /*.theia-btn {
    @apply;
  }*/
</style>
