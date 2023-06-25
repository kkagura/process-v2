import Element, { ELEMENT_PROP_CHANGE } from "../base/Element";
import EventEmitter from "../base/EventEmitter";
import Plugin from "../base/Plugin";
import DefaultPlugin from "../plugin/DefaultPlugin";
import { paintRoundRect } from "../shape";
import { Position, Rect } from "../types/attr";
import { removeItem, setCanvasSize } from "../utils";
import { clipRect, isIntersect, mergeRects } from "../utils/math";
import Layer, { DEFAULT_LAYER_ID } from "./Layer";
import Pot, { POT_ADD_ELEMENT, POT_REMOVE_ELEMENT } from "./Pot";

export default class Process extends EventEmitter {
  topCanvas!: HTMLCanvasElement;
  bottomCanvas!: HTMLCanvasElement;
  layers: Layer[] = [];
  layerMap: Map<string, Layer> = new Map();
  dirtyQueue: Set<Element> = new Set();

  private offsetX = 0;
  private offsetY = 0;
  private plugins: Plugin[] = [];
  private viewRect: Rect = { x: 0, y: 0, width: 0, height: 0 };
  private rectMap: Map<string, Rect> = new Map();
  private zoom: number = 1;
  private debug: boolean = false;
  private isPaintAll: boolean = false;
  private showFps: boolean = false;
  private startTime: number = performance.now();
  private fpsDiv!: HTMLDivElement;

  static DEBUG_COLOR = "#f56c6c";
  static DEBUG_LINE_WIDTH = 1;

  handleElementPropChange = (el: Element) => {
    this.dirtyQueue.add(el);
  };

  repaint = () => {
    if (this.isPaintAll) {
      this.paintAll();
      this.isPaintAll = false;
    } else {
      this.paint();
    }
    const endTime = performance.now();
    const deltaTime = endTime - this.startTime;
    const fps = Math.round(1000 / deltaTime);
    this.startTime = endTime;
    this.setFps(fps);
    requestAnimationFrame(this.repaint);
  };

  handleMousedown = (e: MouseEvent) => {
    const elements = this.getElementsAt(e);
    this.plugins.forEach((p) => {
      p.handleMousedown(elements, e);
    });
  };

  handleMousemove = (e: MouseEvent) => {
    this.plugins.forEach((p) => {
      p.handleMousemove(e);
    });
  };

  handleMouseup = (e: MouseEvent) => {
    this.plugins.forEach((p) => {
      p.handleMouseup(e);
    });
  };

  handleMouseleave = (e: MouseEvent) => {
    this.plugins.forEach((p) => {
      p.handleMouseleave(e);
    });
  };

  handleScroll = (e: Event) => {
    this.plugins.forEach((p) => {
      p.handleScroll(e);
    });
  };

  constructor(public el: HTMLElement, public pot: Pot) {
    super();
    this.initPlugins();
    this.initDom();
    this.initLayer();
    this.initPot();
    this.initEvent();
    requestAnimationFrame(this.repaint);
  }

  initEvent() {
    this.topCanvas.addEventListener("mousedown", this.handleMousedown);
    this.topCanvas.addEventListener("mousemove", this.handleMousemove);
    this.topCanvas.addEventListener("mouseup", this.handleMouseup);
    this.topCanvas.addEventListener("mouseleave", this.handleMouseleave);
    this.topCanvas.addEventListener("scroll", this.handleScroll);
  }

  initPlugins() {
    this.plugins = [new DefaultPlugin(this)];
  }

  initPot() {
    this.pot.on(POT_ADD_ELEMENT, (el) => {
      if (!el.layerId) {
        el.layerId = DEFAULT_LAYER_ID;
        const defaultLayer = this.getDefaultLayer();
        defaultLayer.add(el);
      } else {
        const layer = this.layerMap.get(el.layerId) || this.getDefaultLayer();
        layer.add(el);
      }
      this.dirtyQueue.add(el);
      el.on(ELEMENT_PROP_CHANGE, this.handleElementPropChange);
    });
    this.pot.on(POT_REMOVE_ELEMENT, (el) => {
      const layer = this.layerMap.get(el.layerId)!;
      layer.remove(el);
      this.dirtyQueue.add(el);
      el.off(ELEMENT_PROP_CHANGE, this.handleElementPropChange);
    });
  }

  initDom() {
    this.el.style.position = "relative";
    this.topCanvas = document.createElement("canvas");
    Object.assign(this.topCanvas.style, {
      left: 0,
      top: 0,
      position: "absolute",
    });
    this.bottomCanvas = document.createElement("canvas");
    Object.assign(this.bottomCanvas.style, {
      left: 0,
      top: 0,
      position: "absolute",
    });
    this.resizeCanvas();
    this.el.appendChild(this.bottomCanvas);
    this.el.appendChild(this.topCanvas);
    const fpsDivHtml = `
    <div
      style="
        position: absolute;
        top: 0;
        left: 0;
        width: 40px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 12px;
        color: red;
        display: none;
      "
    ></div>
    `;
    const dom = document.createElement("div");
    dom.innerHTML = fpsDivHtml;
    this.fpsDiv = dom.children[0] as HTMLDivElement;
    this.el.appendChild(this.fpsDiv);
  }

  initLayer() {
    const defaultLayer = new Layer(DEFAULT_LAYER_ID);
    this.addLayer(defaultLayer);
  }

  addLayer(layer: Layer) {
    if (this.layerMap.has(layer.name)) {
      throw new Error(`图层[${layer.name}]已存在`);
    }
    this.layers.push(layer);
    this.layerMap.set(layer.name, layer);
  }

  removeLayer(layer: Layer) {
    if (layer.name === DEFAULT_LAYER_ID) {
      throw new Error("禁止删除默认图层");
    }
    if (this.layerMap.has(layer.name)) {
      throw new Error(`图层[${layer.name}]不存在`);
    }
    this.layerMap.delete(layer.name);
    removeItem(this.layers, layer);
  }

  getDefaultLayer() {
    return this.layerMap.get(DEFAULT_LAYER_ID)!;
  }

  resizeCanvas() {
    const { width, height, x, y } = this.el.getBoundingClientRect();
    this.offsetX = x;
    this.offsetY = y;
    this.viewRect.width = width;
    this.viewRect.height = height;
    setCanvasSize(this.topCanvas, width, height);
    setCanvasSize(this.bottomCanvas, width, height);
  }

  paintAll() {
    const rect = this.getViewRect();
    const ctx = this.topCanvas.getContext("2d")!;
    ctx.setTransform();
    const dpr = window.devicePixelRatio;
    ctx.scale(dpr, dpr);
    ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
    ctx.save();
    const { x, y } = rect;
    ctx.translate(-x, -y);
    ctx.scale(this.zoom, this.zoom);

    this.layers.forEach((layer) => {
      layer.forEach((el) => {
        const uiRect = el.getUIRect();
        if (isIntersect(uiRect, rect)) {
          if (this.debug) {
            paintRoundRect(rect, ctx, 0);
            ctx.lineWidth = Process.DEBUG_LINE_WIDTH;
            ctx.strokeStyle = Process.DEBUG_COLOR;
            ctx.stroke();
          }
          el.render(ctx);
        }
      });
    });

    ctx.restore();
  }

  paint() {
    const { topCanvas, rectMap } = this;
    if (!this.dirtyQueue.size) return;
    const queue = [...this.dirtyQueue];
    const first = queue[0];
    let rect = queue.reduce((prev, curr) => {
      const newRect = curr.getUIRect();
      const oldRect = rectMap.get(curr.id);
      if (oldRect && oldRect !== newRect) {
        return mergeRects(prev, newRect, oldRect);
      }
      return mergeRects(prev, newRect);
    }, first.getUIRect());
    const viewRect = this.getViewRect();
    this.forEach((el) => {
      if (this.dirtyQueue.has(el)) return;
      const elRect = el.getUIRect();
      // 超出画布范围的不渲染
      if (!isIntersect(elRect, viewRect)) return;

      if (isIntersect(elRect, rect)) {
        queue.push(el);
        rect = mergeRects(rect, elRect);
      }
    });

    rect = clipRect(rect, viewRect);
    const ctx = topCanvas.getContext("2d")!;
    ctx.setTransform();
    const dpr = window.devicePixelRatio;
    ctx.scale(dpr, dpr);
    ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
    // ctx.rect(rect.x, rect.y, rect.width, rect.height);
    // ctx.strokeStyle = "green";
    // ctx.stroke();
    ctx.save();
    const { x, y } = this.getViewRect();
    ctx.translate(-x, -y);
    ctx.scale(this.zoom, this.zoom);
    this.sortByLayer(queue).forEach((el) => {
      if (this.pot.has(el)) {
        const rect = el.getUIRect();
        if (this.debug) {
          paintRoundRect(rect, ctx, 0);
          ctx.lineWidth = Process.DEBUG_LINE_WIDTH;
          ctx.strokeStyle = Process.DEBUG_COLOR;
          ctx.stroke();
        }
        rectMap.set(el.id, rect);
        el.render(ctx);
      }
    });
    ctx.restore();
    this.dirtyQueue = new Set();
  }

  getViewRect() {
    return this.viewRect;
  }

  sortByLayer(elements: Element[]) {
    const { layers } = this;
    const indexMap: Record<string, number> = {};
    layers.forEach((l, i) => (indexMap[l.name] = i));
    return [...elements].sort((a, b) => {
      return indexMap[a.layerId] - indexMap[b.layerId];
    });
  }

  forEach(cb: (el: Element) => void | boolean) {
    this.pot.forEach(cb);
  }

  forEachByLayer(cb: (el: Element) => void | boolean) {
    const { layers } = this;
    let result = false;
    for (let i = layers.length - 1; i >= 0; i--) {
      result = layers[i].reverseForEach(cb);
      if (result) {
        break;
      }
    }
    return result;
  }

  setDebug(enable: boolean) {
    this.debug = enable;
  }

  getElementAt(e: MouseEvent): Element | null {
    let result: Element | null = null;
    const pos = this.getPixelPoint(e);
    this.forEachByLayer((el) => {
      if (el.hit(pos)) {
        result = el;
        return true;
      }
    });
    return result;
  }

  getElementsAt(e: MouseEvent) {
    const elements: Element[] = [];
    const pos = this.getPixelPoint(e);
    this.forEachByLayer((el) => {
      if (el.hit(pos)) {
        elements.push(el);
      }
    });
    return elements;
  }

  getPixelPoint(e: MouseEvent): Position {
    let { offsetX, offsetY } = this;
    let { x, y } = this.getViewRect();
    const { pageX, pageY } = e;
    offsetX = pageX - offsetX;
    offsetY = pageY - offsetY;
    x += offsetX;
    y += offsetY;
    x /= this.zoom;
    y /= this.zoom;
    return { x, y };
  }

  setCursor(cursor: string = "default") {
    this.el.style.cursor = cursor;
  }

  move(offsetX: number, offsetY: number) {
    this.viewRect.x -= offsetX;
    this.viewRect.y -= offsetY;
    this.handleViewRectChange();
  }

  handleViewRectChange() {
    this.isPaintAll = true;
  }

  setFps(fps: number) {
    if (this.showFps) {
      this.fpsDiv.innerText = fps + "";
    }
  }

  setShowFps(s: boolean) {
    this.showFps = s;
    if (s) {
      this.fpsDiv.style.display = "block";
    } else {
      this.fpsDiv.style.display = "none";
    }
  }

  destory() {}
}
