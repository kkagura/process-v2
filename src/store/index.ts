import { Pot, Process } from "@/core";
import EventEmitter from "@/core/base/EventEmitter";
import { InjectionKey, inject } from "vue";

export interface Store {
  eventBus: EventEmitter;
  process: Process;
  pot: Pot;
}

export const storeKey: InjectionKey<Store> = Symbol();

export const useStore = () => inject(storeKey)!;
