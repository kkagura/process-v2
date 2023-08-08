export const useDraggerEvent = <T>(options: {
  onMousedown?(e: MouseEvent, data: T): boolean;
  onDragStart?(e: MouseEvent, data: T): void;
  onDrag?(offsetx: number, offsety: number, event: MouseEvent, data: T): void;
  onDrop?(event: MouseEvent, data: T): void;
}) => {
  const handleMousedown = (e: MouseEvent, data: T) => {
    let startx = e.pageX;
    let starty = e.pageY;
    let start = false;
    if (options.onMousedown && options.onMousedown(e, data) === false) {
      return;
    }
    const handleMousemove = (e: MouseEvent) => {
      e.preventDefault();
      const offsetx = e.pageX - startx;
      const offsety = e.pageY - starty;
      startx = e.pageX;
      starty = e.pageY;
      if (!start) {
        options.onDragStart?.(e, data);
        start = true;
      }
      options.onDrag?.(offsetx, offsety, e, data);
    };
    const { documentElement } = document;
    const handleMouseup = (e: MouseEvent) => {
      options.onDrop?.(e, data);
      documentElement.removeEventListener("mousemove", handleMousemove);
      documentElement.removeEventListener("mouseleave", handleMouseup);
      documentElement.removeEventListener("mouseup", handleMouseup);
    };
    documentElement.addEventListener("mousemove", handleMousemove);
    documentElement.addEventListener("mouseleave", handleMouseup);
    documentElement.addEventListener("mouseup", handleMouseup);
  };
  return handleMousedown;
};
