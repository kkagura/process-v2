import PortAttachment from "../Attachment/PortAttachment";
import Element from "../base/Element";
import { DEFAULT_LAYER_ID } from "../process/Layer";
import { fillText, paintRoundRect } from "../shape";
import { Rect } from "../types/attr";
import { Border, FontStyle } from "../types/style";
import { expandRect } from "../utils/math";

export interface RectElementStyle {
  border?: Border;
  fill: boolean;
  fillColor: string;
  fontStyle?: FontStyle;
}

export default class RectElement extends Element<RectElementStyle> {
  width: number = 80;
  height: number = 50;
  ports: PortAttachment[] = [];
  style: RectElementStyle = {
    border: {
      color: "#348ffc",
      width: 1,
      type: "solid",
    },
    fill: true,
    fillColor: "rgba(148,195,252,0.2)",
    fontStyle: {
      color: "#000",
      fontSize: 14,
      align: "center",
    },
  };
  constructor(public layerId: string = DEFAULT_LAYER_ID) {
    super(layerId);
    this.ports = [
      new PortAttachment("top", this),
      new PortAttachment("right", this),
      new PortAttachment("bottom", this),
      new PortAttachment("left", this),
    ];
  }
  getUIRect(): Rect {
    if (this.uiRect) {
      return this.uiRect;
    }
    const border = this.getStyle<Border>("border");
    let rect = this.getRect();
    if (border) {
      // 加上border的宽度
      rect = expandRect(rect, border.width);
    }
    rect = expandRect(rect, 3);
    return (this.uiRect = rect);
  }
  render(ctx: CanvasRenderingContext2D) {
    const rect = this.getRect();
    ctx.beginPath();
    if (this.getSelected()) {
      //  加一个蒙层效果
      paintRoundRect(expandRect(rect, 3), ctx, 4);

      if (this.getStyle("fill") === true) {
        const fillColor = this.getStyle("fillColor");
        ctx.fillStyle = fillColor;
        ctx.fill();
      }
    }
    ctx.beginPath();
    paintRoundRect(rect, ctx, 4);
    if (this.getStyle("fill") === true) {
      const fillColor = this.getStyle("fillColor");
      ctx.fillStyle = fillColor;
      ctx.fill();
    }
    const border = this.getStyle<Border>("border");
    if (border) {
      ctx.strokeStyle = border.color;
      // todo border types
      ctx.lineWidth = border.width;
      ctx.stroke();
    }
    const label = this.getLabel();
    if (label) {
      fillText(ctx, label, this.style.fontStyle || {}, this.getRect());
    }
    if (this.getSelected() || this.getHover()) {
      this.ports.forEach((port) => {
        port.render(ctx);
      });
    }
  }

  serialize() {}

  static deserialize() {}
}
