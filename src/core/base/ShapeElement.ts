import { Element } from ".";
import PortAttachment from "../Attachment/PortAttachment";
import { DEFAULT_LAYER_ID } from "../process/Layer";
import { Moveable } from "../types/model";

export default abstract class ShapeElement<
    T extends Record<string, any> = Record<string, any>
  >
  extends Element<T>
  implements Moveable
{
  ports: PortAttachment[] = [];
  movable = true;
  constructor(public layerId: string = DEFAULT_LAYER_ID) {
    super(layerId);
    this.ports = [
      new PortAttachment("top", this),
      new PortAttachment("right", this),
      new PortAttachment("bottom", this),
      new PortAttachment("left", this),
    ];
  }
  handleMoveStart() {}
  handleMoving(offsetx: number, offsety: number) {}
  handleMoveEnd(offsetx: number, offsety: number) {}
  move(offsetx: number, offsety: number) {
    let { x, y } = this.getPosition();
    x += offsetx;
    y += offsety;
    this.setPosition({ x, y });
  }
}
