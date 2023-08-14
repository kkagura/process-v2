import {
  Element,
  createControlPoints,
  expandRect,
  getRectByPoints,
  isSamePoint,
} from "..";
import PortAttachment from "../Attachment/PortAttachment";
import { Point, Rect } from "../types/attr";
import { LineStyle } from "../types/style";

interface LinkStyle {
  lineWidth: number;
  lineColor: string;
  lineStyle: LineStyle;
  type: string;
}

export default class LinkElement extends Element<LinkStyle> {
  style: LinkStyle = {
    lineWidth: 2,
    lineColor: "blue",
    lineStyle: "solid",
    type: "",
  };

  startPort: null | PortAttachment = null;
  endPort: null | PortAttachment = null;
  startPoint: Point = { x: 0, y: 0 };
  endPoint: Point = { x: 0, y: 0 };

  points: Point[] | null = null;

  getUIRect(): Rect {
    const rect = this.getRect();
    return expandRect(rect, this.getStyle("lineWidth", 1) + 1);
  }

  setStartPort(port: PortAttachment) {
    const old = this.startPort;
    if (old === port) return;
    this.startPort = port;
    if (port) {
      this.setStartPoint(port.getCenterPosition());
    }
    this.triggerChange("startPort", "base", old, port);
  }

  setEndPort(port: PortAttachment | null) {
    const old = this.endPort;
    if (old === port) return;
    this.endPort = port;
    if (port) {
      this.setEndPoint(port.getCenterPosition());
    }
    this.triggerChange("endPort", "base", old, port);
  }

  setStartPoint(point: Point) {
    const old = this.startPoint;
    if (isSamePoint(point, old)) return;
    this.startPoint = point;
    this.points = null;
    this.triggerChange("startPoint", "base", old, point);
  }

  setEndPoint(point: Point) {
    const old = this.endPoint;
    if (isSamePoint(point, old)) return;
    this.endPoint = point;
    this.points = null;
    this.triggerChange("endPoint", "base", old, point);
  }

  getPoints(): Point[] {
    return (
      this.points ||
      createControlPoints(this.startPoint, "top", this.endPoint, "bottom")
    );
  }

  getRect(): Rect {
    const points = this.getPoints();
    const rect = getRectByPoints(points);
    return rect;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.strokeStyle = this.getStyle("lineColor", "#000");
    ctx.lineWidth = this.getStyle("lineColor", 1);
    const points = this.getPoints();
    points.forEach((p, i) => {
      ctx[i ? "lineTo" : "moveTo"](p.x, p.y);
    });
    ctx.stroke();
  }
}
