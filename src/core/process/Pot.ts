import Box from "../base/Box";
import Element from "../base/Element";
import { EventKey } from "../base/EventEmitter";

export const POT_ADD_ELEMENT: EventKey<[Element]> = Symbol("");
export const POT_REMOVE_ELEMENT: EventKey<[Element]> = Symbol("");

export default class Pot extends Box {
  constructor() {
    super();
  }

  remove(el: Element) {
    super.remove.call(this, el);
    this.emit(POT_REMOVE_ELEMENT, el);
  }

  add(el: Element) {
    super.add.call(this, el);
    this.emit(POT_ADD_ELEMENT, el);
  }
}
