import type { ShadowState } from "./lib/types";

let shapeChangeListener: ReturnType<typeof penpot.on> | undefined;

function sendSelection() {
  if (penpot.selection.length <= 0) {
    penpot.ui.sendMessage({
      type: "selectionchange",
      selection: undefined,
    });
    return;
  }

  const selection = penpot.selection[0];

  penpot.ui.sendMessage({
    type: "selectionchange",
    selection: {
      width: selection.width,
      height: selection.height,
      type: selection.type,
    },
  });
}

function applyShadow(shadow: ShadowState) {
  const blockId = penpot.history.undoBlockBegin();

  penpot.selection.forEach((shape) => {
    shape.shadows = [shadow];
  });

  penpot.history.undoBlockFinish(blockId);
}

penpot.ui.open("Shadow Playground", `?theme=${penpot.theme}`, {
  width: 320,
  height: 600,
});

penpot.on("themechange", (data) => {
  penpot.ui.sendMessage({
    type: "themechange",
    theme: data,
  });
});

penpot.on("selectionchange", () => {
  if (shapeChangeListener) {
    penpot.off(shapeChangeListener);
  }

  if (penpot.selection.length > 0) {
    shapeChangeListener = penpot.on("shapechange", sendSelection, {
      shapeId: penpot.selection[0].id,
    });
  }

  sendSelection();
});

penpot.ui.onMessage((message: { type: string; data?: any }) => {
  switch (true) {
    case message.type === "apply":
      applyShadow(message.data);
      break;
    case message.type === "ready":
      sendSelection();
      break;
  }
});
