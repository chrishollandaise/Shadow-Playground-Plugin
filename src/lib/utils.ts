const CENTER_X = 50;
const CENTER_Y = 150;

const MAX_PREVIEW_SHAPE_WIDTH = 128;
const MAX_PREVIEW_SHAPE_HEIGHT = 128;

const SHADOW_OFFSET = 75;

export function calculateShadowPosFromLightPos(lightPos: {
  x: number;
  y: number;
}) {
  const x = Math.round(((lightPos.x - CENTER_X) / CENTER_X) * -SHADOW_OFFSET);
  const y = Math.round(((lightPos.y - CENTER_Y) / CENTER_Y) * -SHADOW_OFFSET);
  return { x, y };
}

export function calculatePreviewDim(selection: {
  width: number;
  height: number;
}) {
  const aspectRatio = selection.width / selection.height;
  let width = MAX_PREVIEW_SHAPE_WIDTH;
  let height = MAX_PREVIEW_SHAPE_HEIGHT;

  if (aspectRatio <= 1) {
    width = width * aspectRatio;
  } else {
    height = height / aspectRatio;
  }

  return {
    width,
    height,
  };
}

export function getTheme() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("theme") === "light" ? "light" : "dark";
}
