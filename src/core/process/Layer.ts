import Box from "../base/Box";

export const DEFAULT_LAYER_ID = "default";

export default class Layer extends Box {
  constructor(public name: string) {
    super();
  }
}
