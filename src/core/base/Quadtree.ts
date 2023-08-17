import { Element } from ".";
import { Rect } from "../types/attr";
/**
 * 2 1
 * 3 4
 */

export default class Quadtree {
  objects: Element[] = [];
  nodes: Quadtree[] = [];

  constructor(
    public bounds: Rect,
    public maxObjects: number = 10,
    public maxLevels: number = 4,
    public level: number = 0,
    public parent: Quadtree | null = null
  ) {}

  private split() {
    const nextLevel = this.level + 1;
    const { x, y, width, height } = this.bounds;
    const subWidth = width / 2;
    const subHeight = height / 2;
    this.nodes[0] = new Quadtree(
      {
        x: x + subWidth,
        y,
        width: subWidth,
        height: subHeight,
      },
      this.maxObjects,
      this.maxLevels,
      nextLevel,
      this
    );
    this.nodes[1] = new Quadtree(
      {
        x,
        y,
        width: subWidth,
        height: subHeight,
      },
      this.maxObjects,
      this.maxLevels,
      nextLevel,
      this
    );

    this.nodes[2] = new Quadtree(
      {
        x,
        y: y + subHeight,
        width: subWidth,
        height: subHeight,
      },
      this.maxObjects,
      this.maxLevels,
      nextLevel,
      this
    );

    this.nodes[3] = new Quadtree(
      {
        x: x + subWidth,
        y: y + subHeight,
        width: subWidth,
        height: subHeight,
      },
      this.maxObjects,
      this.maxLevels,
      nextLevel,
      this
    );
  }

  getIndex(pRect: Rect) {
    const indexes = [],
      verticalMidpoint = this.bounds.x + this.bounds.width / 2,
      horizontalMidpoint = this.bounds.y + this.bounds.height / 2;

    const startIsNorth = pRect.y < horizontalMidpoint,
      startIsWest = pRect.x < verticalMidpoint,
      endIsEast = pRect.x + pRect.width > verticalMidpoint,
      endIsSouth = pRect.y + pRect.height > horizontalMidpoint;

    //top-right quad
    if (startIsNorth && endIsEast) {
      indexes.push(0);
    }

    //top-left quad
    if (startIsWest && startIsNorth) {
      indexes.push(1);
    }

    //bottom-left quad
    if (startIsWest && endIsSouth) {
      indexes.push(2);
    }

    //bottom-right quad
    if (endIsEast && endIsSouth) {
      indexes.push(3);
    }

    return indexes;
  }

  insert(el: Element) {
    let i = 0,
      indexes,
      pRect = el.getUIRect();

    if (this.nodes.length) {
      indexes = this.getIndex(pRect);

      for (i = 0; i < indexes.length; i++) {
        this.nodes[indexes[i]].insert(el);
      }
      return;
    }

    this.objects.push(el);

    if (this.objects.length > this.maxObjects && this.level < this.maxLevels) {
      if (!this.nodes.length) {
        this.split();
      }

      for (i = 0; i < this.objects.length; i++) {
        indexes = this.getIndex(this.objects[i]);
        for (var k = 0; k < indexes.length; k++) {
          this.nodes[indexes[k]].insert(this.objects[i]);
        }
      }

      this.objects = [];
    }
  }

  remove(el: Element) {
    if (this.nodes.length) {
      const indexs = this.getIndex(el.getUIRect());
      indexs.forEach((index) => {
        this.nodes[index].remove(el);
      });
    } else {
      const i = this.objects.indexOf(el);
      if (i > -1) {
        this.objects.splice(i, 1);
      }
    }
  }

  retrieve(pRect: Rect) {
    var indexes = this.getIndex(pRect),
      returnObjects = this.objects;

    if (this.nodes.length) {
      for (var i = 0; i < indexes.length; i++) {
        returnObjects = returnObjects.concat(
          this.nodes[indexes[i]].retrieve(pRect)
        );
      }
    }

    return [...new Set(returnObjects)];
  }

  clear() {
    this.objects = [];
    this.nodes.forEach((node) => node.clear());
    this.nodes = [];
  }
}
