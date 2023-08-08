<template>
  <div class="model-side">
    <div
      class="model-item"
      v-for="el in models"
      @mousedown="handleDragger($event, el)"
    >
      <img :src="el.icon" :alt="el.label" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import circle from "@/assets/images/circle.svg";
import rect from "@/assets/images/rect.svg";
import rhombus from "@/assets/images/rhombus.svg";
import capsule from "@/assets/images/capsule.svg";
import { useDraggerEvent } from "@/hooks";
import { useStore } from "@/store";
import { Element } from "@/core";
import { isChildNode } from "@/core";
import { Process } from "@/core";

const models = reactive([
  {
    class: "Circle",
    icon: circle,
    label: "Start",
  },
  {
    class: "Rect",
    icon: rect,
    label: "Normal",
  },
  {
    class: "Rhombus",
    icon: rhombus,
    label: "Decision",
  },
  {
    class: "Capsule",
    icon: capsule,
    label: "Model",
  },
]);

const store = useStore();
const { process, pot } = store;

let currentNode: Element | null = null;
const handleDragger = useDraggerEvent<(typeof models)[number]>({
  onDrag(offsetx, offsety, event, data) {
    if (!currentNode) {
      if (isChildNode(process.el, event.target as HTMLElement)) {
        currentNode = Process.modelFactory(data.class);
        if (currentNode) {
          currentNode.setLabel(data.label);
          pot.add(currentNode);
        }
      }
    }
    currentNode?.setCenterPosition(process.getPixelPoint(event));
  },
  onDrop(event, data) {
    if (!isChildNode(process.el, event.target as HTMLElement)) {
      currentNode && pot.remove(currentNode);
    }
    if (currentNode) {
      process.defaultPlugin.setSelection([currentNode]);
      currentNode = null;
    }
  },
});
</script>

<style lang="postcss" scoped>
.model-side {
  box-sizing: border-box;
  height: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .model-item {
    margin: 0 auto 30px;
    cursor: pointer;
  }
}
</style>
