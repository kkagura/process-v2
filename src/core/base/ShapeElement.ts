import { Element } from ".";
import PortAttachment from "../Attachment/PortAttachment";
import { DEFAULT_LAYER_ID } from "../process/Layer";

export default abstract class ShapeElement<
  T extends Record<string, any> = Record<string, any>
> extends Element<T> {
  ports: PortAttachment[] = [];
  constructor(public layerId: string = DEFAULT_LAYER_ID) {
    super(layerId);
    this.ports = [
      new PortAttachment("top", this),
      new PortAttachment("right", this),
      new PortAttachment("bottom", this),
      new PortAttachment("left", this),
    ];
  }
}
