import Element from "./Element";

export default abstract class Attachment extends Element {
  host: Element | null = null;
}
