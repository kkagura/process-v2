<template>
  <div class="editor-page">
    <div class="toolbar"></div>
    <div class="main">
      <div class="model-side-container">
        <ModelSide />
      </div>
      <div class="canvas-container" ref="$container"></div>
      <div class="prop-side-container"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Pot, Process } from "@/core";
import { onMounted, provide, ref } from "vue";
import ModelSide from "@/components/ModelSide.vue";
import { storeKey } from "@/store";
import EventEmitter from "@/core/base/EventEmitter";
const $container = ref();
const pot = new Pot();
const process = new Process(pot);
provide(storeKey, {
  eventBus: new EventEmitter(),
  pot,
  process,
});
onMounted(() => process.mount($container.value));
</script>

<style lang="less" scoped>
.editor-page {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  * {
    box-sizing: border-box;
  }
  .toolbar {
    height: 46px;
    border-bottom: var(--border-style);
    background-color: var(--background-color-light);
  }
  .main {
    flex: 1;
    overflow: hidden;
    display: flex;
    .model-side-container {
      width: 200px;
      border-right: var(--border-style);
      height: 100%;
      overflow: hidden;
    }
    .canvas-container {
      height: 100%;
      flex: 1;
      overflow: hidden;
    }
    .prop-side-container {
      width: 270px;
      border-left: var(--border-style);
      height: 100%;
      overflow: hidden;
    }
  }
  --border-style: 1px solid #e6f7ff;
  --background-color-light: #fafafa;
}
</style>
