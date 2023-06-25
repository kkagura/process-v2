interface Callback<Args extends unknown[]> {
  (...args: Args): void;
}

interface CallbackWrapper<Args extends unknown[]> extends Callback<Args> {
  realCallback: Callback<Args>;
}

export interface EventKey<Args extends unknown[]> extends Symbol {}

export default class EventEmitter {
  private events: Map<EventKey<unknown[]>, Function[]> = new Map();

  public on<T extends unknown[]>(type: EventKey<T>, callback: Callback<T>) {
    const cbs = this.events.get(type);
    if (cbs) {
      cbs.push(callback);
    } else {
      this.events.set(type, [callback]);
    }
  }

  public once<T extends unknown[]>(type: EventKey<T>, callback: Callback<T>) {
    const wrap: CallbackWrapper<T> = (...args: T) => {
      callback(...args);
      this.off(type, wrap);
    };
    wrap.realCallback = callback;
    this.on(type, wrap);
  }

  off<T extends unknown[]>(type: EventKey<T>, callback: Callback<T>) {
    const cbs = this.events.get(type);
    if (cbs) {
      const rest = cbs.filter((fn) => {
        return (
          fn !== callback && (fn as CallbackWrapper<T>).realCallback !== fn
        );
      });
      this.events.set(type, rest);
    }
  }

  clear<T extends unknown[]>(type?: EventKey<T>) {
    if (type) {
      this.events.delete(type);
    } else {
      this.events.clear();
    }
  }

  emit<T extends unknown[]>(type: EventKey<T>, ...args: T) {
    const cbs = this.events.get(type);
    cbs?.forEach((fn) => fn(...args));
  }
}
