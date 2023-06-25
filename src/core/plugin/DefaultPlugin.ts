import Element, {
  ELEMENT_MOUSE_ENTER,
  ELEMENT_MOUSE_LEAVE,
} from "../base/Element";
import Plugin from "../base/Plugin";

export default class DefaultPlugin extends Plugin {
  mousedown: boolean = false;
  selectionList: Set<Element> = new Set();
  clickTarget: Element | null = null;
  hoverTarget: Element | null = null;
  pageX: number = 0;
  pageY: number = 0;

  handleMousedown(targets: Element[], e: MouseEvent): void {
    this.process.setCursor("move");
    this.pageX = e.pageX;
    this.pageY = e.pageY;
    const topEl = targets[targets.length - 1];
    this.clickTarget = topEl || null;
    if (topEl) {
      if (e.metaKey || e.ctrlKey) {
        this.addSelection(topEl);
      } else {
        this.setSelection([topEl]);
      }
    } else {
      this.setSelection([]);
    }
    this.mousedown = true;
  }

  handleMousemove(e: MouseEvent): void {
    if (this.mousedown) {
      if (this.selectionList.size === 0) {
        this.moveCanvas(e);
      } else {
        this.moveSelection(e);
      }
    } else {
      const el = this.process.getElementAt(e);
      const { clickTarget } = this;
      if (clickTarget != el) {
        if (clickTarget) {
          clickTarget.setHover(false);
          clickTarget.emit(ELEMENT_MOUSE_LEAVE, clickTarget);
        }
        this.clickTarget = el || null;
        if (el) {
          el.setHover(true);
          el.emit(ELEMENT_MOUSE_ENTER, el);
        }
      }
    }
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
