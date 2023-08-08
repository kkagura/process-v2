import Element from "./Element";

export default abstract class Attachment<
  T extends Record<string, any> = any
> extends Element<T> {
  host: Element | null = null;
  setHost(host: Element) {
    this.host = host;
  }
  getHost() {
    return this.host;
  }
}
