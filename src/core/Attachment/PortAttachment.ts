import { expandRect } from "../utils";
import { Attachment, Element } from "../base";
import { Direction, Rect } from "../types/attr";

export default class PortAttachment extends Attachment<{}> {
  style: Record<string, any> = {};
  width: number = 6;
  height: number = 6;
  constructor(public direction: Direction, public host: Element) {
    super();
  }

  setY() {}

  getY() {
    const { direction } = this;
    const host = this.getHost()!;
    const { y, height } = host.getRect();
    if (direction === "top") return y - this.getHeight() / 2;
    if (direction === "bottom") return y + height - this.getHeight() / 2;
    return y + height / 2 - this.getHeight() / 2;
  }

  getX() {
    const { direction } = this;
    const host = this.getHost()!;
    const { x, width } = host.getRect();
    if (direction === "left") return x - this.getWidth() / 2;
    if (direction === "right") return x + width - this.getWidth() / 2;
    return x + width / 2 - this.getWidth() / 2;
  }

  getRect() {
    return {
      x: this.getX(),
      y: this.getY(),
      width: this.getWidth(),
      height: this.getHeight(),
    };
  }

  getUIRect(): Rect {
    const uiRect = this.uiRect;
    if (uiRect) return uiRect;
    const rect = this.getRect();
    return expandRect(rect, 1);
  }

  render(ctx: CanvasRenderingContext2D) {
    const host = this.host;
    if (!host) return;
    const { x, y, width, height } = this.getRect();
    ctx.beginPath();
    ctx.arc(x + width / 2, y + height / 2, width / 2, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#348ffc";
    ctx.lineWidth = 1;
    ctx.fill();
    ctx.stroke();
  }
}
