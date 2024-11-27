<script lang="ts">
  import { shadowStore, previewStore } from "../store";
  import { calculatePreviewDim } from "../utils";
  import Light from "./light.svelte";
  import type { SelectionState } from "../types";
  const { selection, isSelected } = $props<{
    selection: SelectionState | undefined;
    isSelected: boolean;
  }>();

  $effect(() => {
    if(!isSelected) {
      previewStore.reset();
      return;
    }
    const { width, height } = calculatePreviewDim(selection);
    previewStore.set({ width, height, type: selection.type });
  });

  const previewStyles = $derived(() => {
    return `--shadow-offset-x: ${$shadowStore.offsetX}px; 
            --shadow-offset-y: ${$shadowStore.offsetY}px; 
            --shadow-blur: ${$shadowStore.blur}px; 
            --shadow-spread: ${$shadowStore.spread}px; 
            --shadow-color: ${$shadowStore.color.color};
            --shadow-opacity: ${$shadowStore.color.opacity};
            --shadow-style: ${$shadowStore.style === 'drop-shadow' ? '' : 'inset'};
            --width: ${$previewStore.width}px;
            --height: ${$previewStore.height}px;
            --border-radius: ${$previewStore.type === 'ellipse' ? '50%' : '0'};`;
  })
</script>

<div id="preview-wrapper">
  <div id="preview" 
    class:selected={isSelected}
    style="{previewStyles()}"></div>
  <Light />
</div>


<style>

#preview-wrapper {
    position: relative;
    overflow: hidden;
    width: 100%;
    min-height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--spacing-32);
}
  #preview {
    background-color: #B1B2B5;
    position: relative;
    transition: width 500ms cubic-bezier(0.645, 0.045, 0.355, 1.000),
                height 500ms cubic-bezier(0.645, 0.045, 0.355, 1.000),
                border-radius 500ms cubic-bezier(0.645, 0.045, 0.355, 1.000);
    width: var(--width);
    height: var(--height);
    border-radius: var(--border-radius);
    transform: rotate(var(--rotation));
  }

  #preview::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    z-index: 1;
  }

  #preview::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: var(--shadow-offset-x) var(--shadow-offset-y) var(--shadow-blur) var(--shadow-spread) var(--shadow-color) var(--shadow-style);
    opacity: var(--shadow-opacity);
    transition: opacity 500ms cubic-bezier(0.680, -0.550, 0.265, 1.550);
    z-index: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    #preview {
      transition: none;
    }

    #preview::after {
      transition: none;
    }
  }

</style>