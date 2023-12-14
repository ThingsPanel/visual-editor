<!--
 * @Author: chaoxiaoshu-mx leukotrichia@163.com
 * @Date: 2023-07-20 11:03:20
 * @LastEditors: chaoxiaoshu-mx leukotrichia@163.com
 * @LastEditTime: 2023-11-22 11:21:33
 * @FilePath: \tp-editor\src\editor\components\right-attribute-panel\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

<template>
        <ElTabs style="height: 100%;overflow: auto;" v-model="activeName">
            <el-tab-pane style="height: 100%" :label="!isEdge?'外观':'线条样式'" name="attr">
                <!-- 画布样式 -->
                <CanvasAttr v-if="!isNode&&!isEdge" v-model="attrData" @onChange="onCanvasAttrChange"/>
                <div style="height: 100%" v-if="isNode">
                    <!-- 节点基础样式 -->
                    <BaseAttr :data="nodeData" @onChange="onBaseChange"/>

                    <!-- 自定义样式 -->
                    <component v-if="attributeCpt" :currentNode='nodeId' :bindData="bindData" :data="attrData" :is="attributeCpt" v-on="actionHandlers"
                            @onChange="onChange" />
                    <Attribute v-else-if="defaultAttr" :data="nodeData" :attr="defaultAttr" @onChange="onChange"/>
                    <BaseNodeAttr v-else-if="!attributeCpt && !defaultAttr" :data="nodeData" @onChange="onChange"/>
                </div>

                <!-- 边样式 -->
                <LineAttr v-if="isEdge" :tools="useTools()" :edgeData="edgeData" :nodeData="nodeData" @onChange="onChange"/>
            </el-tab-pane>
            <!-- 数据绑定 -->
            <el-tab-pane label="数据" name="data" v-if="!isEdge && isNode">
                <template v-if="false">
                    <component v-if="isNode" :is="dataCpt" :data="bindData"  @onChange="onChange">
                        <!-- 设备数据 -->
                        <BaseData :data="bindData" @onChange="onChange"/>
                    </component>
                </template>
                <template v-else>
                    <Data :data="bindData" @onChange="onChange"/>
                </template>
                
            </el-tab-pane>
            <!-- 图层 -->
            <el-tab-pane label="图层" name="layer">
                <LayerAttr :nodeData='nodeData' :cellList='cellList' :initEvents='initEvents'/>
            </el-tab-pane>
        </ElTabs>
</template>

<script setup lang="ts">
import { useTools } from '@/editor/hooks'

import { ref, onMounted, reactive, watch, toRaw, getCurrentInstance } from "vue";
import CanvasAttr from "./components/CanvasAttr.vue";
import BaseAttr from "./components/BaseAttr.vue";
import LineAttr from "./components/LineAttr.vue";
import LayerAttr from "./components/LayerAttr.vue";
import Attribute from "./components/Attribute.vue";
import Data from "./components/Data.vue";
import BaseData from './components/baseData/index.vue';
import BaseNodeAttr from "./components/BaseNodeAttr.vue"
import { useEvents } from "./useEvents"
import { useAttribute } from "./useAttribute"
import { parseJSONData } from '@/utils';

const activeName = ref("attr");
let {
    isNode, attributeCpt, defaultAttr, dataCpt, defaultData, nodeData,edgeData,
    isEdge,nodeId,
    initEvents, onChange, onBaseChange,
    cellList
} = useEvents();
const cellIndex=ref(-1)
// 自定义样式
const attrData = ref<any>({});
// 数据绑定
const bindData = ref<any>({});

const { proxy } = <any>getCurrentInstance();
proxy.$style("world");

watch(nodeData, (value) => {
    cellIndex.value = -1
    if (!value) return;
    if (!value.data) {
        attrData.value = {};
        bindData.value = JSON.parse(JSON.stringify(defaultData.value));
        console.log("====watch", value, bindData.value)

        return;
    }
    const jsonObj = parseJSONData(value.data.jsonData);
    attrData.value = {...jsonObj.style};
    bindData.value = {...jsonObj.data};

})

let actionHandlers = reactive({})
onMounted(() => {
    initEvents();
});

let {
    onCanvasAttrChange
} = useAttribute();

</script>

<style lang="scss" scoped></style>