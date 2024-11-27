import { writable } from "svelte/store";
import type { ShadowState, PreviewState, LightState } from "./types";

const DEFAULT_PREVIEW_STATE: PreviewState = {
  width: 128,
  height: 128,
  type: "square",
};

export const previewStore = (() => {
  const store = writable<PreviewState>(DEFAULT_PREVIEW_STATE);

  return {
    ...store,
    reset: () => store.set(DEFAULT_PREVIEW_STATE),
  };
})();

export const shadowStore = writable<ShadowState>({
  offsetX: 0,
  offsetY: 0,
  blur: 10,
  spread: 0,
  color: {
    color: "#000000",
    opacity: 0.2,
  },
  style: "drop-shadow",
});

export const lightStore = writable<LightState>({
  x: 50,
  y: 50,
});
