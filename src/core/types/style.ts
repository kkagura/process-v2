export type LineStyle = "solid" | "dash" | "dotted";

export interface Border {
  width: number;
  color: string;
  type: LineStyle;
}

export interface FontStyle {
  fontFamily?: string;
  fontSize?: number;
  bold?: boolean;
  itatic?: boolean;
  textDecoration?: "underline" | "overline" | "none";
  align?: "left" | "center" | "right";
  color?: string;
}
