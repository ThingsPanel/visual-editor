<!-- 图层 -->
<template>

<div style='height:700px;overflow-y: auto;overflow-x: hidden;padding: 0 6px'>
  <el-row :gutter="20">
    <el-col style='margin-top:6px' :span="24" v-for="(data, tIndex) in layerList" key='data.view.cell.id' @click.stop='layerClick($event,data.view,tIndex)'>
      <el-card :body-style="{padding: '0px 12px',height:'60px',display:'flex',justifyContent:'space-between',alignItems:'center',border:data.view.cell.id===theCellIndex?'1px solid #40affe':undefined}">
        <img v-if="pluginConfig.getComponent(data.view
        .cell.shape)?.icon" width='50' height='50' :src="pluginConfig.getComponent(data.view
        .cell.shape)?.icon" alt=''>
        <img v-else-if="data.view.cell.shape==='edge'" width='50' height='50' :src="edgeLayerIcon" alt=''>
        <img v-else width='50' height='50' :src="defaultIcon" alt=''>
        <div  v-else style='width: 50px;height: 50px;background-color: #409EFF;color: white;text-align:center;line-height: 50px'>
          {{data.view.cell.label}}
        </div>

        <div >
          <span style='font-size: 12px;'>顺序：</span>
          <el-input-number size='small' :min='0' :max='layerList.length' style='max-width: 75px;' v-model="statList[tIndex].zIndex"   @change='zIndexChange($event,data)' />
          <el-switch
              size='small'
              @change='showCell($event,tIndex,data)'
              v-model="statList[tIndex].isShow"
              class="ml-2"
              inline-prompt
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              active-text="显示"
              inactive-text="影藏"
          />
          <el-button style='margin-left: 5px' type='text'  :icon="Delete" @click.stop='deleteCell(data.view)' />
<!--          <el-switch-->
<!--              v-model="layerList[index].isE"-->
<!--              @change='editCell($event,index,i)'-->
<!--              class="ml-2"-->
<!--              inline-prompt-->
<!--              style="&#45;&#45;el-switch-on-color: #13ce66; &#45;&#45;el-switch-off-color: #ff4949"-->
<!--              active-text="可编辑"-->
<!--              inactive-text="禁用编辑"-->
<!--          />-->
        </div>
      </el-card>
    </el-col>

  </el-row>

</div>

</template>

<script setup lang="ts">
import {
  Delete,
} from '@element-plus/icons-vue'
import {onMounted, ref, watch} from "vue";
import {uniqWith, isEqual, forEach} from "lodash"
import {PluginConfig} from "@/editor/config";
import defaultIcon from "@/assets/defaultIcon.svg";
import edgeLayerIcon from "@/assets/edgeLayerIcon.svg";
import {useEvents} from "@/editor/components/right-attribute-panel/useEvents";


let pluginConfig: IPluginConfig;
onMounted(() => {
  pluginConfig = PluginConfig.getInstance();
})
const theCellIndex=ref<any>(-1)
const statList=ref<any>([])
const props = defineProps({
  cellList: {
    type: Array,
    default: () => ([])
  },initEvents:{
    type:Function,
    default: () => {}
  },cellIndex:{
    type:Number,
    default:-1
  },nodeData:{
    default:undefined
  }
})
let u9=0
const showCell= (v: any, index: any, i: any)=>{
   i.view.cell.setVisible(v)
}

const deleteCell=(d:any)=>{
d.cell.remove()
}
const zIndexChange=(val:any,d:any)=>{
   d.view.cell.zIndex=val
}
const editCell= (v: any, index: any, i: any)=>{

//Todo 未完成
}
const layerList=ref<any[]>([])
const layerClick=(e:any,d:any,index:any)=> {
  u9=1
  if(d.cell.shape!=='edge'){
    d.graph.trigger('node:click',{ e:e, node: d.cell })
  }else{
    d.graph.clearTransformWidgets();
  }
  d.graph.trigger('cell:click', { e:e, cell: d.cell });
  theCellIndex.value=d.cell.id
}

watch(props,(v)=>{
  if(u9!==1){
    theCellIndex.value=-1
  }
  if(v?.nodeData){
    theCellIndex.value=v.nodeData.id
  }

  layerList.value=v.cellList
  layerList.value.forEach((data:any)=>{
    statList.value.push({isShow:data.view.cell.isVisible(),isEdit:true,zIndex:data.view.cell.zIndex})
  })
  u9=0
})


</script>

<style lang="scss" scoped>

</style>