<!--
 * @Author: chaoxiaoshu-mx leukotrichia@163.com
 * @Date: 2023-07-04 11:01:51
 * @LastEditors: chaoxiaoshu-mx leukotrichia@163.com
 * @LastEditTime: 2023-11-15 15:29:57
 * @FilePath: \tp-editor\src\market\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-drawer :model-value="visible" @close="$emit('update:visible', false)" direction="rtl" class="market-drawer"
    size="1200px" append-to-body :with-header="false">

    <div class="flex h-12 items-center justify-between px-3 border-b border-gray-200">
      <div class="w-36 text-left">
        <el-button :icon="ArrowLeftBold" link @click="$emit('update:visible', false)">返回</el-button>
      </div>
      <span>插件市场</span>
      <div class="w-36 text-right">
      </div>
    </div>

    <Login v-if="!state.isLogined" :submit="onSubmit" />

    <Market v-if="state.isLogined" />
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from "vue";
import { ArrowLeftBold, HelpFilled } from '@element-plus/icons-vue'
import Login from "./Login.vue"
import Market from "./Market.vue"
import { useMarketStore } from "@/store";
const props = defineProps<{
  visible: boolean
}>();

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void
}>();

const state = reactive({
  isLogined: false
})

onMounted(async () => {
  let status = await useMarketStore().loginStatus()
  state.isLogined = status;
})

const onSubmit = () => {
  state.isLogined = true
}

</script>

<style lang="scss" scoped></style>