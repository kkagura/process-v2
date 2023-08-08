import PortAttachment from "../Attachment/PortAttachment";
import Element from "../base/Element";
import { DEFAULT_LAYER_ID } from "../process/Layer";
import { fillText, paintRoundRect } from "../shape";
import { Rect } from "../types/attr";
import { Border, FontStyle } from "../types/style";
import { expandRect } from "../utils/math";

export interface CricleElementStyle {
  border?: Border;
  fill: boolean;
  fillColor: string;
  fontStyle?: FontStyle;
}

export default class CircleElement extends Element<CricleElementStyle> {
  width: number = 70;
  height: number = 70;
  ports: PortAttachment[] = [];
  style: CricleElementStyle = {
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
    const rect = this.getRect();
    if (!border) {
      return (this.uiRect = { ...rect });
    }
    return (this.uiRect = expandRect(rect, border.width + 4));
  }
  render(ctx: CanvasRenderingContext2D) {
    const rect = this.getRect();
    ctx.beginPath();
    if (this.getSelected()) {
      //  加一个蒙层效果
      // paintRoundRect(expandRect(rect, 3), ctx, 4);

      if (this.getStyle("fill") === true) {
        const fillColor = this.getStyle("fillColor");
        ctx.fillStyle = fillColor;
        ctx.fill();
      }
    }
    ctx.beginPath();
    const width = this.getWidth();
    ctx.arc(
      rect.x + rect.width / 2,
      rect.y + rect.height / 2,
      width / 2,
      0,
      2 * Math.PI
    );
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
