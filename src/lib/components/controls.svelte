<script lang="ts">
  import { shadowStore, previewStore } from "../store";
  import Blur from "../../assets/icons/blur.svelte";
  import Palette from "../../assets/icons/palette.svelte";
  import Spread from "../../assets/icons/move-horizontal.svelte";
  import Eclipse from "../../assets/icons/eclipse.svelte";
  import type { SelectionState } from "../types";

  const { selection, isSelected } = $props<{
    selection: SelectionState | undefined;
    isSelected: boolean;
  }>();

  const opacityDisplay = ($shadowStore.color.opacity * 100).toFixed(0);

  function handleOpacityInput(e: Event) {
    const input = e.target as HTMLInputElement;
    const value = Number(input.value);
    
    if (!isNaN(value) && value >= 0 && value <= 100) {
      $shadowStore.color.opacity = value / 100;
    } else {
      $shadowStore.color.opacity = 1;
      input.value = "100";
    }
  }

  function handleApply() {
    if (!selection) return;
    const scaleX = selection.width / $previewStore.width;
    const scaleY = selection.height / $previewStore.height;
    const maxScale = Math.max(scaleX, scaleY);


    parent.postMessage({
      type: "apply",
      data: {
        offsetX: $shadowStore.offsetX * scaleX,
        offsetY: $shadowStore.offsetY * scaleY,
        blur: $shadowStore.blur * maxScale,
        spread: $shadowStore.spread * maxScale,
        color: {
          color: $shadowStore.color.color,
          opacity: $shadowStore.color.opacity,
        },
        style: $shadowStore.style,
      }
    }, '*');
  }
</script>

<div class="controls">
  <div class="blur">
    <label for="blur-input">
      <Blur />
      <span class="headline-s">Blur: {$shadowStore.blur}</span>
    </label>
    <input 
      id="blur-input"
      type="range" 
      bind:value={$shadowStore.blur} 
      min="0" 
      max="50" 
    />
  </div>

  <div class="spread">
    <label for="spread-input">
      <Spread />
      <span class="headline-s">Spread: {$shadowStore.spread}</span>
    </label>
    <input 
      id="spread-input"
      type="range" 
      bind:value={$shadowStore.spread} 
      min="0" 
      max="10" 
    />
  </div>

  <div class="control">
    <div style="display: flex; gap: var(--spacing-8);">
      <div style="width: 50%;">
        <label class="control-item" for="color-input">
          <Palette />
          <span class="headline-s">Color</span>
        </label>
        <div>
          <input 
            id="color-input"
            type="color" 
            bind:value={$shadowStore.color.color}
            class="color-input"
          />
          <div style="display: flex; gap: var(--spacing-4); width: 100%;">
            <button
              type="button" 
              aria-label="Color Picker"
              class="color-display" 
              style="background-color: {$shadowStore.color.color}; width: 75%"
              onclick={() => document.getElementById("color-input")?.click()}
            ></button>
              <input 
                id="opacity-input"
                class="input" 
                type="text" 
                style="width: 25%"
                onfocus={(e) => (e.target as HTMLInputElement).select()}
                value={opacityDisplay}
                oninput={handleOpacityInput}
                placeholder="--"
              />
          </div>
        </div>
      </div>

      <div class="type">
        <label class="control-item" for="type-select">
          <Eclipse />
          <span class="headline-s">Type</span>
        </label>
        <div>
          <select class="select" id="type-select" bind:value={$shadowStore.style}>
            <option value="drop-shadow">Drop shadow</option>
            <option value="inner-shadow">Inner shadow</option>
          </select>
        </div>
      </div>
    </div>
  </div>

    <button 
      class="apply"
      disabled={!isSelected} 
      onclick={handleApply}
      type="button" 
      data-appearance="primary"
    >
    <div>
      <span>Apply</span>
    </div>
  </button>
</div>

<style>
  label {
    display: flex;
    align-items: center;
    gap: var(--spacing-4);
    user-select: none;
  }

  .control-item {
    margin-bottom: var(--spacing-8);
  }

  #color-input {
    display: none;
  }

  .color-display {
    border-top-left-radius: var(--spacing-4);
    border-bottom-left-radius: var(--spacing-4);
  }

  #opacity-input {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  #opacity-input::after {
    content: '%';
    position: absolute;
    right: var(--spacing-4);
    top: 50%;
    transform: translateY(-50%);
    color: var(--figma-color-text);
    pointer-events: none;
  }

  .controls {
    padding-top: var(--spacing-8);
    display: grid;
    gap: var(--spacing-16);
    grid-template-areas: 
      "blur blur"
      "spread spread"
      "control control"
      "buttons buttons";
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto auto;
  }

  .blur {
    grid-area: blur;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-8);
  }

  .spread {
    grid-area: spread;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-8);
  }

  .control {
    grid-area: control;
  }

  .apply {
    grid-area: buttons;
    display: flex;
    width: 100%;
    gap: var(--spacing-4);
    justify-content: center;
    align-items: center;
  }

  .type {
    width: 50%;
  }
</style> 