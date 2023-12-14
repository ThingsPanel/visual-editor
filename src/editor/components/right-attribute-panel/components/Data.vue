<!--
 * @Author: chaoxiaoshu-mx leukotrichia@163.com
 * @Date: 2023-11-15 09:25:01
 * @LastEditors: chaoxiaoshu-mx leukotrichia@163.com
 * @LastEditTime: 2023-11-21 10:57:17
 * @FilePath: \tp-editor\src\editor\components\right-attribute-panel\components\Data.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div style="height:100%">
        <el-row style="margin-bottom: 10px">
            <el-radio-group v-model="formData.bindType">
              <el-radio label="static" size="small">静态数据</el-radio>
              <el-radio label="dynamic" size="small">动态数据</el-radio>
              <el-radio label="device" size="small">设备数据</el-radio>
            </el-radio-group>
        </el-row>
        <el-row style="height:100%">
            <!-- 静态数据 -->
            <el-input v-if="formData.bindType==='static'" :rows="20" type="textarea" v-model="formData.static"></el-input>
            <!-- 动态数据 -->
            <el-form-item v-else-if="formData.bindType==='dynamic'" style="width:100%">
              <el-input :rows="2" type="textarea" v-model="formData.dynamic"></el-input>
            </el-form-item>
            <!-- 设备数据 -->
            <div class="w-full" v-else-if="formData.bindType==='device'" >
              <!-- 设备数据 -->
              <BaseData :data="formData.deviceData" @onChange="onDeviceChange"/>
            </div>
            
        </el-row>
      </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, toRaw } from "vue";
import BaseData from './baseData/index.vue';
const props = defineProps({
    data:  {
        type: Object,
        default: () => ({})
    }
})
let formData = reactive({
    bindType: 'static',
    static: "文本",
    dynamic: "",
    deviceData: []
});
const emit = defineEmits([ "onChange" ]);
// 初始化副本
let previousFormData = JSON.parse(JSON.stringify(formData));
watch(formData, (val) => {
    if (JSON.stringify(val) === JSON.stringify(previousFormData)) return;
    emit("onChange", { data: { ...val } });
    // 更新 previousValue 为当前值的副本
    previousFormData = JSON.parse(JSON.stringify(val));
}, { deep: true })

watch(() => props.data, (val: any) => {
    formData.bindType = val?.bindType || "static";
    if (val?.static) {
        if (typeof val.static === "object") 
            formData.static = JSON.stringify(val.static, null, 4);
        else {
            formData.static = val.static
        }
    } else {
        formData.static = "文本";
    }
    formData.dynamic = val?.dynamic || "";
    formData.deviceData = val?.deviceData || [];
}, { immediate: true })

function onDeviceChange(v: any) {
    console.log("====onDeviceChange", v)
    emit("onChange", { data: { bindType: 'device', deviceData: toRaw(v) }})
}
</script>

<style lang="scss" scoped>

</style>