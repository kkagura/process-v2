<template>
  <div class="container" ref="$container"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  Process,
  Pot,
  RectElement,
  ELEMENT_MOUSE_ENTER,
  ELEMENT_MOUSE_LEAVE,
} from "./core";

const $container = ref();
const pot = new Pot();
let process: Process | null = null;
onMounted(() => {
  process = new Process($container.value, pot);
  process.setShowFps(true);
  const r = new RectElement();
  r.on(ELEMENT_MOUSE_ENTER, () => {
    console.log("mouse enter");
  });
  r.on(ELEMENT_MOUSE_LEAVE, () => {
    console.log("mouse leave");
  });
  let x = 100;
  r.setX(x++);
  r.setY(500);
  r.setWidth(100);
  r.setHeight(100);
  pot.add(r);

  const r2 = new RectElement();
  r2.setStyle("fillColor", "blue");
  r2.setWidth(200);
  r2.setHeight(100);
  pot.add(r2);
});
</script>

<style>
body {
  margin: 0;
}
.container {
  width: 100vw;
  height: 100vh;
}
</style>
