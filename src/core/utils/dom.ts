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
