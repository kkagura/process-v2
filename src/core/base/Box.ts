import { removeItem } from "../utils";
import Element from "./Element";
import EventEmitter, { EventKey } from "./EventEmitter";

export default class Box extends EventEmitter {
  private elements: Element[] = [];
  private elementMap: Map<string, Element> = new Map();

  add(el: Element) {
    if (this.elementMap.has(el.id)) {
      throw new Error(`ID[${el.id}]已存在`);
    }
    this.elementMap.set(el.id, el);
    this.elements.push(el);
  }

  remove(el: Element) {
    if (!this.elementMap.has(el.id)) {
      throw new Error(`ID[${el.id}]不存在`);
    }
    this.elementMap.delete(el.id);
    removeItem(this.elements, el);
  }

  forEach(cb: (el: Element) => void | boolean) {
    const res = this.elements.some((el) => cb(el));
    return res;
  }

  reverseForEach(cb: (el: Element) => void | boolean) {
    const { elements } = this;
    let res = false;
    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i];
      const filter = cb(el);
      if (filter === true) {
        res = true;
        break;
      }
    }
    return res;
  }

  has(el: Element) {
    return this.elementMap.has(el.id);
  }
}
