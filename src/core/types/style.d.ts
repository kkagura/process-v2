export interface Border {
  width: number;
  color: string;
  type: "solid" | "dash" | "dotted";
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
