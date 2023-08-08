import { DEFAULT_LAYER_ID } from "../process/Layer";
import { Position, Rect, Size } from "../types/attr";
import { pixelTest } from "../utils/canvas";
import { randomString } from "../utils/utils";
import Attachment from "./Attachment";
import EventEmitter, { EventKey } from "./EventEmitter";

export type ElementPropType = "base" | "client" | "style";

// 属性值改变
export const ELEMENT_PROP_CHANGE: EventKey<
  [Element<any>, ElementPropType, string, any, any]
> = Symbol("");
// 鼠标移入
export const ELEMENT_MOUSE_ENTER: EventKey<[Element<any>]> = Symbol();
// 鼠标移出
export const ELEMENT_MOUSE_LEAVE: EventKey<[Element<any>]> = Symbol();
export default abstract class Element<
  Style extends Record<string, any> = Record<string, any>
> extends EventEmitter {
  width: number = 0;
  height: number = 0;
  x: number = 0;
  y: number = 0;
  id: string = randomString();
  visible: boolean = true;
  parent: Element | null = null;
  uiRect: Rect | null = null;
  rect: Rect | null = null;
  abstract style: Style;
  selected: boolean = false;
  hover: boolean = false;
  label: string = "";

  constructor(public layerId: string = DEFAULT_LAYER_ID) {
    super();
  }

  getSize(): Size {
    return {
      width: this.width,
      height: this.height,
    };
  }

  getPosition(): Position {
    return {
      x: this.getX(),
      y: this.getY(),
    };
  }

  setPosition(pos: Position) {
    const { x, y } = pos;
    this.setX(x);
    this.setY(y);
  }

  setCenterPosition(pos: Position) {
    let { x, y } = pos;
    const { width, height } = this.getSize();
    x -= width / 2;
    y -= height / 2;
    this.setPosition({ x, y });
  }

  setId(id: string) {
    this.id = id;
  }

  setWidth(w: number) {
    if (this.width === w) return;
    this.width = w;
    this.rect = null;
    this.uiRect = null;
    const oldVal = this.width;
    this.triggerChange("width", "base", oldVal, w);
  }

  getWidth() {
    return this.width;
  }

  setHeight(h: number) {
    if (this.height === h) return;
    this.height = h;
    this.rect = null;
    this.uiRect = null;
    const oldVal = this.height;
    this.triggerChange("height", "base", oldVal, h);
  }

  getHeight() {
    return this.height;
  }

  getX() {
    return this.x;
  }

  setX(x: number) {
    if (this.x === x) return;
    const oldVal = this.x;
    this.rect = null;
    this.uiRect = null;
    this.x = x;
    this.triggerChange("x", "base", oldVal, x);
  }

  getY() {
    return this.y;
  }

  setY(y: number) {
    if (this.y === y) return;
    this.y = y;
    this.rect = null;
    const oldVal = this.y;
    this.triggerChange("y", "base", oldVal, y);
  }

  getRect(): Rect {
    return (
      this.rect ||
      (this.rect = {
        x: this.getX(),
        y: this.getY(),
        width: this.getWidth(),
        height: this.getHeight(),
      })
    );
  }

  setStyle(key: keyof Style, val: any) {
    if (this.style[key] === val) return;
    const old = this.getStyle(key);
    this.style[key] = val;
    this.triggerChange(key, "style", old, val);
  }

  getStyle<T = any>(key: keyof Style): T | null {
    return this.style[key];
  }

  abstract getUIRect(): Rect;

  triggerChange(prop: any, type: ElementPropType, oldVal: any, newVal: any) {
    this.emit(ELEMENT_PROP_CHANGE, this, type, prop, oldVal, newVal);
  }

  getLayerId() {
    return this.layerId;
  }

  hit(position: Position) {
    const { x, y, width, height } = this.getRect();
    if (
      position.x >= x &&
      position.y >= y &&
      position.x <= x + width &&
      position.y <= y + height
    ) {
      return this.hitOnPixel(position);
    }
    return false;
  }

  hitOnAttachment(position: Position) {}

  hitOnPixel(position: Position) {
    return pixelTest(this.render.bind(this), position, this.getRect());
  }

  getVisible() {
    return this.visible;
  }

  setVisible(v: boolean) {
    if (v === this.visible) return;
    const old = this.visible;
    this.visible = v;
    this.triggerChange("visible", "base", old, v);
  }

  setSelected(s: boolean) {
    if (s === this.selected) return;
    const old = this.selected;
    this.selected = s;
    this.triggerChange("selected", "base", old, s);
  }

  getSelected() {
    return this.selected;
  }

  setHover(s: boolean) {
    if (s === this.hover) return;
    const old = this.hover;
    this.hover = s;
    this.triggerChange("hover", "base", old, s);
  }

  getHover() {
    return this.hover;
  }

  setLabel(label: string) {
    if (label === this.label) return;
    const old = this.label;
    this.label = label;
    this.triggerChange("label", "base", old, label);
  }

  getLabel() {
    return this.label;
  }

  abstract render(ctx: CanvasRenderingContext2D): void;

  static JsonData() {}
}
