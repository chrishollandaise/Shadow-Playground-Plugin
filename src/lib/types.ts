export type ShadowState = {
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: {
    color: string;
    opacity: number;
  };
  style: "drop-shadow" | "inner-shadow";
};

export type LightState = {
  x: number;
  y: number;
};

export type PreviewState = {
  width: number;
  height: number;
  type: string;
};

export type SelectionState = {
  width: number;
  height: number;
  type: string;
};
