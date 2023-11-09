<!--
 * @Author: chaoxiaoshu-mx leukotrichia@163.com
 * @Date: 2023-07-04 11:01:51
 * @LastEditors: chaoxiaoshu-mx leukotrichia@163.com
 * @LastEditTime: 2023-11-08 11:16:42
 * @FilePath: \tp-editor\src\editor\components\left-aside\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div :id="Common.DEFAULT_STENCIL_CONTAINER_ID" class="w-full"></div>
</template>

<script setup lang="ts">
import * as Common from "@/common";
</script>

<style lang="scss" scoped>
:deep(.x6-widget-stencil-content) {
  height: calc(100% - 120px);
}
</style>
