import { LinkElement } from "..";
import PortAttachment from "../Attachment/PortAttachment";
import Element, {
  ELEMENT_MOUSE_ENTER,
  ELEMENT_MOUSE_LEAVE,
} from "../base/Element";
import Plugin from "../base/Plugin";
import ShapeElement from "../base/ShapeElement";

export default class DefaultPlugin extends Plugin {
  mousedown: boolean = false;
  selectionList: Set<Element> = new Set();
  clickTargetEl: Element | null = null;
  clickTargetPort: PortAttachment | null = null;
  hoverTargetEl: Element | null = null;
  pageX: number = 0;
  pageY: number = 0;
  linkEl: LinkElement | null = null;

  handleMousedown(targets: Element[], e: MouseEvent): void {
    this.mousedown = true;
    this.pageX = e.pageX;
    this.pageY = e.pageY;
    const topEl = targets[targets.length - 1];
    this.clickTargetEl = topEl || null;
    if (topEl) {
      if (topEl instanceof ShapeElement) {
        const ports = topEl.ports;
        const point = this.process.getPixelPoint(e);
        const port = ports.find((p) => p.hit(point)) || null;
        this.clickTargetPort = port;
      } else {
        this.clickTargetPort = null;
      }
      if (e.metaKey || e.ctrlKey) {
        this.addSelection(topEl);
      } else {
        if (!topEl.getSelected()) {
          this.setSelection([topEl]);
        }
      }
    } else {
      this.setSelection([]);
    }
  }

  handleMousemove(e: MouseEvent): void {
    if (this.mousedown) {
      if (this.clickTargetPort) {
        if (!this.linkEl) {
          this.createLink();
          const point = this.process.getPixelPoint(e);
          this.linkEl!.setEndPoint(point);
          this.process.pot.add(this.linkEl!);
        }
        const linkEl = this.linkEl!;
        // const els = this.process.getElementsAt(e);
        // const el = els.find((e) => e !== linkEl);
        // if (el) {
        // } else {
        //   const point = this.process.getPixelPoint(e);
        //   linkEl.setEndPoint(point);
        // }
        const point = this.process.getPixelPoint(e);
        linkEl.setEndPoint(point);

        return;
      }
      this.process.setCursor("move");
      if (this.selectionList.size === 0) {
        this.moveCanvas(e);
      } else {
        this.moveSelection(e);
      }
    } else {
      const el = this.process.getElementAt(e);
      const { hoverTargetEl } = this;
      if (hoverTargetEl != el) {
        if (hoverTargetEl) {
          hoverTargetEl.setHover(false);
          hoverTargetEl.emit(ELEMENT_MOUSE_LEAVE, hoverTargetEl);
        }
        this.hoverTargetEl = el || null;
        if (el) {
          el.setHover(true);
          el.emit(ELEMENT_MOUSE_ENTER, el);
        }
      }
    }
  }

  createLink() {
    const port = this.clickTargetPort!;
    const host = port.getHost()!;
    const layerId = host.getLayerId();
    this.linkEl = new LinkElement(layerId);
    this.linkEl.setStartPort(port);
  }

  getOffset(e: MouseEvent) {
    const { pageX, pageY } = this;
    const offsetX = e.pageX - pageX;
    const offsetY = e.pageY - pageY;
    this.pageX = e.pageX;
    this.pageY = e.pageY;
    return { offsetX, offsetY };
  }

  moveCanvas(e: MouseEvent) {
    const { offsetX, offsetY } = this.getOffset(e);
    this.process.move(offsetX, offsetY);
  }

  moveSelection(e: MouseEvent) {
    const { offsetX, offsetY } = this.getOffset(e);
    this.selectionList.forEach((el) => {
      let { x, y } = el.getPosition();
      x += offsetX;
      y += offsetY;
      el.setPosition({ x, y });
    });
  }

  handleMouseup(e: MouseEvent): void {
    this.process.setCursor();
    this.linkEl = null;
    this.clickTargetEl = null;
    this.clickTargetPort = null;
    this.mousedown = false;
  }

  handleMouseleave(e: MouseEvent) {
    this.process.setCursor();
    this.mousedown = false;
  }

  setSelection(elements: Element[]) {
    const oldSelection = this.selectionList;
    this.selectionList = new Set(elements);
    oldSelection.forEach((el) => {
      if (!this.selectionList.has(el)) {
        el.setSelected(false);
      }
    });
    this.selectionList.forEach((el) => {
      if (!oldSelection.has(el)) {
        el.setSelected(true);
      }
    });
  }

  addSelection(el: Element) {
    this.selectionList.add(el);
    el.setSelected(true);
  }

  removeSelection(el: Element) {
    this.selectionList.delete(el);
    el.setSelected(false);
  }
}
