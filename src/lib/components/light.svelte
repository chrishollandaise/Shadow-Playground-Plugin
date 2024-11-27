<script lang="ts">
  import { onMount } from "svelte";
  import { calculateShadowPosFromLightPos } from "../utils";
  import { lightStore, shadowStore } from "../store";
  import Sun from "../../assets/icons/sun.svelte";

  let dragging = $state(false);

  function updateShadowPosition() {
    const newShadowPos = calculateShadowPosFromLightPos($lightStore);
    $shadowStore.offsetX = newShadowPos.x;    
    $shadowStore.offsetY = newShadowPos.y;
  }

  function handleMouseMove(event: MouseEvent) {
    if (!dragging) return;
    
    const container = document.getElementById('preview-wrapper');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const newX = ((event.clientX - rect.left) / rect.width) * 100;
    const newY = event.clientY - rect.top;

    lightStore.set({
      x: Math.max(0, Math.min(100, newX)),
      y: Math.max(0, Math.min(rect.height, newY))
    });

    updateShadowPosition();
  }

  onMount(() => {
    updateShadowPosition();
  });
</script>

<svelte:document on:mousemove={handleMouseMove} on:mouseup={() => dragging = false}/>

<div 
    class="light-wrapper"
    role="button"
    tabindex="0"
    style="left: {$lightStore.x}%; top: {$lightStore.y}px; cursor: {dragging ? 'grabbing' : 'grab'}" 
    onmousedown={() => dragging = true}
>
    <Sun />
</div>

<style>
  .light-wrapper {
    position: absolute;
    transform: translate(-50%, -50%);
    padding: var(--spacing-12);
  }
</style>