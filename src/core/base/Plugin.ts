import { Process } from "..";
import Element from "./Element";
import EventEmitter from "./EventEmitter";

export default abstract class Plugin extends EventEmitter {
  constructor(public process: Process) {
    super();
  }

  handleMousedown(targets: Element[], e: MouseEvent) {}

  handleMousemove(e: MouseEvent) {}

  handleMouseup(e: MouseEvent) {}

  handleMouseleave(e: MouseEvent) {}

  handleScroll(e: Event) {}

  beforePaint(ctx: CanvasRenderingContext2D) {}

  afterPaint(ctx: CanvasRenderingContext2D) {}
}
