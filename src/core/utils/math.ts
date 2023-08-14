import { Direction, Point, Rect } from "../types/attr";

export const mergeRects = (rect1: Rect, ...rects: Rect[]) => {
  const result: Rect = { ...rect1 };
  [...rects].forEach((r) => {
    // 更新合并后的矩形的位置和尺寸
    const minX = Math.min(r.x, result.x);
    const minY = Math.min(r.y, result.y);
    const maxX = Math.max(r.x + r.width, result.x + result.width);
    const maxY = Math.max(r.y + r.height, result.y + result.height);

    result.x = minX;
    result.y = minY;
    result.width = maxX - minX;
    result.height = maxY - minY;
  });
  return result;
};

export const isIntersect = (rectangle1: Rect, rectangle2: Rect) => {
  var rect1Right = rectangle1.x + rectangle1.width;
  var rect1Bottom = rectangle1.y + rectangle1.height;
  var rect2Right = rectangle2.x + rectangle2.width;
  var rect2Bottom = rectangle2.y + rectangle2.height;

  // 判断两个矩形是否相交
  if (
    rectangle1.x < rect2Right &&
    rect1Right > rectangle2.x &&
    rectangle1.y < rect2Bottom &&
    rect1Bottom > rectangle2.y
  ) {
    return true; // 两个矩形相交
  } else {
    return false; // 两个矩形不相交
  }
};

export const clipRect = (r1: Rect, r2: Rect): Rect => {
  const { x: x1, y: y1, width: w1, height: h1 } = r1;
  const { x: x2, y: y2, width: w2, height: h2 } = r2;
  const x = Math.max(x1, x2);
  const y = Math.max(y1, y2);
  const width = Math.min(x1 + w1, x2 + w2) - x;
  const height = Math.min(y1 + h1, y2 + h2) - y;
  return { width, height, x, y };
};

export const expandRect = (rect: Rect, size: number): Rect => {
  const { x, y, width, height } = rect;
  return {
    x: x - size,
    y: y - size,
    width: width + size * 2,
    height: height + size * 2,
  };
};

export const getDistance = (p1: Point, p2: Point) => {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

export const isSamePoint = (p1: Point, p2: Point, dis: number = 0) => {
  if (p1 === p2 || (p1.x === p2.x && p1.y === p2.y)) return true;
  if (dis === 0) return false;
  return getDistance(p1, p2) <= dis;
};

export const createControlPoints = (
  start: Point,
  startDir: Direction,
  end: Point,
  endDir: Direction
): Point[] => {
  return [start, end];
};

export const getRectByPoints = (points: Point[]): Rect => {
  const first = points[0];
  let minx = first?.x ?? 0,
    miny = first?.y ?? 0,
    maxx = first?.x ?? 0,
    maxy = first?.y ?? 0;
  for (let i = 0; i < points.length; i++) {
    const { x, y } = points[i];
    if (x < minx) minx = x;
    if (x > maxx) maxx = x;
    if (y < miny) miny = y;
    if (y > maxy) maxy = y;
  }
  return {
    x: minx,
    y: miny,
    width: maxx - minx,
    height: maxy - miny,
  };
};
