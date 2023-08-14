export interface Position {
  x: number;
  y: number;
}

export type Point = Position;

export interface Size {
  width: number;
  height: number;
}

export type Direction = "top" | "left" | "right" | "bottom";

export type Rect = Position & Size;
