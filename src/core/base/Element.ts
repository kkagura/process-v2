import { EventEmitter } from "puppeteer";
import { Position, Size } from "../types/attr";

export default abstract class Element extends EventEmitter {
  width: number = 0;
  height: number = 0;
  x: number = 0;
  y: number = 0;
  getSize(): Size {
    return {
      width: this.width,
      height: this.height,
    };
  }
  getPosition(): Position {
    return {
      x: this.x,
      y: this.y,
    };
  }

  abstract render(): () => any;
}
