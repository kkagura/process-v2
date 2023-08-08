export const setCanvasSize = (
  canvas: HTMLCanvasElement,
  width: number,
  height: number
) => {
  const dpr = window.devicePixelRatio;
  canvas.width = Math.round(dpr * width);
  canvas.height = Math.round(dpr * height);
  Object.assign(canvas.style, {
    width: `${width}px`,
    height: `${height}px`,
  });
};

export const isChildNode = (parent: HTMLElement, child: HTMLElement) => {
  let temp: HTMLElement | null = child;
  while (temp) {
    if (temp.parentElement === parent) return true;
    temp = temp.parentElement;
  }
  return false;
};
