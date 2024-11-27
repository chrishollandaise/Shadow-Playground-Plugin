<script lang="ts">
  import { onMount } from "svelte";
  import Controls from "./lib/components/controls.svelte";
  import Preview from "./lib/components/preview.svelte";
  import { getTheme } from "./lib/utils";
  import type { SelectionState } from "./lib/types";
  import { shadowStore } from "./lib/store";

  let selection = $state<SelectionState | undefined>(undefined);
  let isSelected = $derived(!!selection);
  let theme = $state(getTheme());

  function handleMessage(event: MessageEvent) {
    switch(true) {
      case event.data.type === "selectionchange":
        selection = event.data.selection;
        break;
      case event.data.type === "themechange":
        theme = event.data.theme;
        break;
    }
  }

  onMount(() => {
    window.parent.postMessage({
      type: "ready",
    }, "*");
  });

  $shadowStore.color.opacity = 0.2

</script>

<svelte:window on:message={handleMessage}/>

<main data-theme={theme}>
  <Preview {selection} {isSelected} />
  <Controls {selection} {isSelected}  />
</main>