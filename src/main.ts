import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import EventEmitter from "@/core/base/EventEmitter";

const ee1 = new EventEmitter();
const ee2 = new EventEmitter();

// ee1.on("test1", () => {});
// ee2.on("test2", () => {});
console.log(ee1.on === ee2.on);

createApp(App).mount("#app");
