import { LinkElement } from "..";
import PortAttachment from "../Attachment/PortAttachment";
import Element, {
  ELEMENT_MOUSE_ENTER,
  ELEMENT_MOUSE_LEAVE,
} from "../base/Element";
import Plugin from "../base/Plugin";
import ShapeElement from "../base/ShapeElement";
import { Moveable } from "../types/model";

export default class DefaultPlugin extends Plugin {
  mousedown: boolean = false;
  selectionList: Set<Element> = new Set();
  clickTargetEl: Element | null = null;
  clickTargetPort: PortAttachment | null = null;
  hoverTargetEl: Element | null = null;
  pageX: number = 0;
  pageY: number = 0;
  linkEl: LinkElement | null = null;
  moveTargets: Set<Moveable> = new Set();
  moveStartCalled: boolean = false;

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
        this.moveTargets.add(this.process);
      } else {
        this.selectionList.forEach((el: any) => {
          if (el.movable) {
            this.moveTargets.add(el);
          }
        });
      }
      this.move(e);
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

  move(e: MouseEvent) {
    const { offsetX, offsetY } = this.getOffset(e);
    this.moveTargets.forEach((el) => {
      el.move(offsetX, offsetY);
      if (this.moveStartCalled) {
        el.handleMoving(offsetX, offsetY);
      } else {
        el.handleMoveStart();
      }
    });
  }

  handleMouseup(e: MouseEvent): void {
    const { pageX, pageY } = e;
    const offsetx = pageX - this.pageX;
    const offsety = pageY - this.pageY;
    if (offsetx !== 0 || offsety !== 0) {
      if (this.moveTargets.size != 0) {
        this.moveTargets.forEach((el) => el.handleMoveEnd(offsetx, offsety));
      }
    }
    this.process.setCursor();
    this.linkEl = null;
    this.clickTargetEl = null;
    this.clickTargetPort = null;
    this.mousedown = false;
    this.moveTargets.clear();
    this.moveStartCalled = false;
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
