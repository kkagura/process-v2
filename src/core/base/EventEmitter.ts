interface CallbackFn {
  (...args: any[]): void;
  realCallback?: Function;
}

export default class EventEmitter {
  private events: Record<string, (CallbackFn | Function)[]> =
    Object.create(null);

  public on(type: string, callback: Function) {
    if (this.events[type]) {
      this.events[type].push(callback);
    } else {
      this.events[type] = [callback];
    }
  }

  public once(type: string, callback: Function) {
    const wrap = (...args: any[]) => {
      callback(...args);
      this.off(type, wrap);
    };
    wrap.realCallback = callback;
    this.on(type, wrap);
  }

  off(type: string, callback: Function) {
    if (this.events[type]) {
      this.events[type] = this.events[type].filter((fn) => {
        return fn !== callback && (fn as CallbackFn).realCallback !== fn;
      });
    }
  }

  clear(type?: string) {
    if (type) {
      this.events[type] = [];
    } else {
      this.events = Object.create(null);
    }
  }

  emit(type: string, ...args: any[]) {
    this.events[type]?.forEach((fn) => fn(...args));
  }
}
