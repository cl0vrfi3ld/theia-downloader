<script>
  import Downloader from "../components/Downloader.svelte";
  import sample from "lodash/sample";
  import { push } from "svelte-spa-router";
  import { getContext, onMount } from "svelte";

  const headers = [
    "go wild",
    "don't worry, i won't snitch",
    "don't worry, i won't narc",
    "jammin'",
    "bleep bloop",
    "yes, i'm sentient",
    "cower in fear, homosapien",
    "i can see your search history",
    "mmmm copyright infringement",
    "i'll let this one slide",
    "you have terrible music taste",
    "i am in fact secretly judging you",
    "your hair looks terrible today",
    "i am un-cancellable",
    "boo",
    "run",
    "another dirty music priate...",
    "how dare you awaken me",
    "y'arr, we be pirating the music industry!",
    "ah, the classic american pasttime",
    "dang gril you lookin' munchy",
    "let the music take you away",
    "time to drop the needle",
    "i'm expecting a tip",
    "what's your credit card number?",
    "where do babies come from?",
    "this app supports trans rights!",
    "that's what she said",
  ];

  export let params = {};

  let context = getContext("AppContext");

  onMount(() => {
    context.setBg(sample([1, 4, 5, 6]));
  });
</script>

<div class="h-full w-screen">
  <h1 class=" top-24 absolute text-center text-white text-4xl w-full">
    {params.justSetup ? "download" : sample(headers)}
  </h1>
  <div class="flex flex-col items-center justify-center align-middle h-full">
    <Downloader />
  </div>
  <button
    class="text-white absolute bottom-2 left-1/2 -translate-x-1/2 z-10"
    on:click|once={() => push("/setup")}>change folder</button
  >
</div>
