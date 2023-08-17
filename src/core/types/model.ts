export interface Moveable {
  handleMoveStart: () => void;
  handleMoving: (offsetx: number, offsety: number) => void;
  handleMoveEnd: (offsetx: number, offsety: number) => void;
  move: (offsetx: number, offsety: number) => void;
  movable: boolean;
}
