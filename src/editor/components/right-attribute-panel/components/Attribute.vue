<!--
 * @Author: chaoxiaoshu-mx leukotrichia@163.com
 * @Date: 2023-11-16 16:50:15
 * @LastEditors: chaoxiaoshu-mx leukotrichia@163.com
 * @LastEditTime: 2023-11-22 09:19:53
 * @FilePath: \tp-editor\src\editor\components\right-attribute-panel\components\Attribute.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE`
-->
<template>
  <el-collapse v-model="state.activeNames">
    <el-collapse-item v-for="attr in state.attributes" :key="attr.key || attr.label" :title="attr.label" :name="attr.key || attr.label">
      
      <template v-if="attr.key">
        <el-form v-model="state.formData[attr.key]" label-width="80px" label-position="left">
          <el-form-item v-for="item in attr.children" :key="item.key" :label="item.label">
            <!-- 数值输入框 -->
            <el-input v-if="item.type==='number'" type="number" v-model="state.formData[attr.key][item.key]"/>
            <!-- 字符串输入框 -->
            <el-input v-if="item.type==='input'" v-model="state.formData[attr.key][item.key]"/>
            <!-- 颜色输入框 -->
            <tp-color-picker v-if="item.type==='color'" v-model="state.formData[attr.key][item.key]" />
            <!-- 下拉列表 -->
            <el-select v-if="item.type==='select'" v-model="state.formData[attr.key][item.key]">
              <el-option v-for="option in item.options" :key="option.value" :label="option.label" :value="option.value"/>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      
      <template v-else>
        <el-form v-model="state.formData" label-width="80px" label-position="left">
          <el-form-item v-for="item in attr.children" :key="item.key" :label="item.label">
            <!-- 数值输入框 -->
            <el-input v-if="item.type==='number'" type="number" v-model="state.formData[item.key]"/>
            <!-- 字符串输入框 -->
            <el-input v-if="item.type==='input'" v-model="state.formData[item.key]"/>
            <!-- 颜色输入框 -->
            <tp-color-picker v-if="item.type==='color'" v-model="state.formData[item.key]" />
            <!-- 下拉列表 -->
            <el-select v-if="item.type==='select'" v-model="state.formData[item.key]">
              <el-option v-for="option in item.options" :key="option.value" :label="option.label" :value="option.value"/>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      
    </el-collapse-item>
  </el-collapse>
</template>

<script setup lang="ts">
import { CanvasConfig } from "@/editor/config";
import { ref, reactive, watch, toRaw, onMounted, inject } from "vue";
import { isJSON } from "@/utils"

const props = defineProps({
  attr: {
    type: Object,
    default: () => []
  },
  data: {
    type: Object,
    default: () => ({})
  }
});
const emit = defineEmits(["onChange"]);


const state = reactive<{
  activeNames: string | string[],
  attributes: AttributeItem[],
  formData: any
}>({
  activeNames: [""],
  attributes: [],
  formData: {}
});

// 监听表单属性
watch(() => props.attr, (val: any) => {
  state.attributes = groupByGroup(toRaw(val));
  state.formData = getDefaultData(toRaw(state.attributes));
}, { immediate: true });

// 监听表单的值
watch(() => props.data, (val: any) => {
  const jsonStr = toRaw(val)?.data?.jsonData || undefined;
  const jsonObj = isJSON(jsonStr);
  if (!jsonObj.style) {
    state.formData = getDefaultData(toRaw(state.attributes));
  } else {
    state.formData = { ...jsonObj.style };
    state.activeNames = jsonObj.style?.activeNames || [""];
  }
}, { immediate: true, deep: true })

// 表单的值改变时，调用onChange函数
watch(state.formData, (val: any) => {
  emit("onChange", { style: { ...toRaw(val), activeNames: toRaw(state.activeNames)}});
}, { deep: true });


/**
 * @description: 获取默认值
 * @param {*} val
 * @return {*}
 */
function getDefaultData(val: AttributeItem[]): any {
  if (!val) return undefined;
  let formData: any = {};
  val.forEach((item: AttributeItem) => {
    if (item.key) {
      formData[item.key] = {};
      item.children?.forEach((child: AttributeItem) => {
        formData[item.key][child.key] = child.default;
      })
    } else {
      item.children?.forEach((child: AttributeItem) => {
        formData[child.key] = child.default;
      })
    }
  })
  return formData;
}

interface AttributeItem {
  key: string;
  label: string;
  type?: string;
  default?: number | string;
  group?: string | object;
  options?: Array<{ label: string; value: string }>;
  children?: Array<AttributeItem>;
}
/**
 * @description: 重新分组
 * @param {*} items
 * @return {*}
 */
function groupByGroup(items: AttributeItem[]): AttributeItem[] {
  const grouped: AttributeItem[] = [];

  items.forEach(item => {
    let group: any = undefined;
    if (typeof item.group === "string") {
      // group为字符串
      group = { label: item.group };
    } else {
      // group为对象
      group = item;
    }
    let index = grouped.findIndex(item => item.key === group.key);
    if (index !== -1) {
      // 如果grouped中已存在group，则添加到group的children里
      grouped[index].children?.push(item);
    } else {
      // 如果不存在
      grouped.push({
        key: group.key,
        label: group.label || group.key,
        children: [{ ...item }]
      });
    }
  });
  return grouped;
}
</script>

<style lang="scss" scoped></style>