<template>
  <div class="editAlert" v-if="EditEdgeMode.isEditEdgeMode" >

      <spna>进入自由画线，拖动鼠标开始画线，拖动过程中单击加节点，直接单击或在线上右键退出,</spna>
  </div>
    <div class="relative w-full">

        <div class="absolute text-left pl-6">
            <el-icon class="align-middle" :size="20">
                <House />
              </el-icon>
            <!-- <span class="align-middle pl-6" style="overflow:hidden;text-overflow:ellipsis" @dblclick="handleDBClick">
              {{ name }}
            </span> -->
            <span class="align-middle pl-6" style="overflow:hidden;text-overflow:ellipsis" @dblclick="handleDBClick">
              <el-input class="input-name" style="width:140px" v-model="state.visualName" @change="handleChangeVisualName"></el-input>
            </span> 
            <span class="align-middle pl-6 saving-state">{{ savingState }}</span>
        </div>
        <div class="head_tools ml-64 mr-[400px] w-auto" style="overflow-x:auto;overflow-y:hidden">
          <div class="inline-flex">
            <!--        变色测试按钮  *@author; 王炳宏 -->
            <!-- <el-button @click="attrColor">变色</el-button> -->
            <el-button text @click="undo" :icon="RefreshLeft">撤销</el-button>
            <el-button text @click="redo" :icon="RefreshRight">重做</el-button>
            <el-button text :icon="Link" @click="changeEditEdgeMode">{{ EditEdgeMode.isEditEdgeMode?"取消连线":"连线" }}</el-button>
            <el-button text @click="zoomToFit" :icon="Crop">自适应</el-button>
            <el-button text @click="zoomOut" :icon="ZoomOut">缩小</el-button>
            <el-button text>{{ state.scaling + '%' }}</el-button>
            <el-button text @click="zoomIn" :icon="ZoomIn">放大</el-button>
            <!-- <el-button @click="disableSnapline">关闭对齐线</el-button> -->
            <!-- <el-button @click="enableSnapline">开启对齐线</el-button> -->
            <!-- 选择文件 -->
            <el-upload
              ref="uploadRef"
              class="upload-demo"
              v-model:file-list="fileList"
              action=""
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleChange"
            >
              <template #trigger>
                <el-button text style="margin-left: 12px;" :icon="Download">导入</el-button>
              </template>
            </el-upload>

            <el-dropdown class="el-dropdown"
                @command="handleCommandExport"
                >
                <span class="el-dropdown-link" @click="handleClickExport">
                  <el-button text :icon="Upload">导出</el-button>
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="json">导出JSON</el-dropdown-item>
                    <el-dropdown-item command="svg">导出SVG</el-dropdown-item>
                    <el-dropdown-item command="png">导出PNG</el-dropdown-item>
                    <el-dropdown-item command="jpeg">导出JPEG</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            <el-button text @click="preview()" :icon="View">预览</el-button>
          </div>
        </div>

        <div class="absolute inset-y-0 right-0 w-auto">
            <el-button :icon="Share" id="share-btn" @click="state.shareVisible = true" >分享</el-button>
            <el-button :icon="UploadFilled" @click="state.publishVisible = true">发布</el-button>
            <el-button :icon="CircleCheck" @click="save(params.id)">保存</el-button>
            <el-button :icon="QuestionFilled" @click="help" >帮助</el-button>
            <el-button :icon="HomeFilled" @click="state.marketVisible = true">插件市场</el-button>
        </div>
    </div>
    <!-- 发布 -->
    <PublishForm v-model:visible="state.publishVisible" v-model:data="state"/>
    <!-- 分享 -->
    <ShareForm v-model:visible="state.shareVisible"/>
    <!-- 插件市场 -->
    <Market v-model:visible="state.marketVisible"/>
</template>

<script setup lang="ts">
import { ref, reactive, inject, onMounted, watch, computed } from "vue";
import { House, HomeFilled,RefreshLeft,Link, RefreshRight, ZoomOut, ZoomIn, Crop, View, Download, Upload, UploadFilled, Share, CircleCheck, SwitchButton, QuestionFilled } from "@element-plus/icons-vue";
import { ArrowDown } from '@element-plus/icons-vue';
import { exportFile, readFile } from "@/utils";
import { CanvasConfig } from "@/editor/config";
import AuthAPI from "@/api/auth";
import { useTools } from "@/editor/hooks";
import Market from "@/market/index.vue";
import {useIsEditEdgeMode} from "@/store/modules/isEditEdgeaModeStore";
import { VisualAPI } from "@/api";
import { message } from "@/utils/tool";
import ShareForm from "./ShareForm.vue";
import PublishForm from "./PublishForm.vue"
const props = defineProps({ 
    tools: {
        type: Object,
        default: () => {}
    },
    name: {
      type: String,
      default: ''
    }
});

const {
  state,
  savingState,
  undo,
  redo,
  zoomToFit, 
  zoomOut, 
  zoomIn,
  getZoom,
  disableSnapline,
  enableSnapline,
  importJSON,
  exportPNG,
  exportJPEG,
  exportSVG,
  toJSON,
  preview,
  help,
  save,
  autoSave,
  share,
  publishScreen
} = useTools();
const params: any = inject("params", null)
watch(() => props.name, (val) => {
  if (!val) return;
  state.visualName = val;
}, { immediate: true })
/**
 * 更改大屏名称
 * @param val 
 */
const handleChangeVisualName = (val: string) => {
  if (!val || !params.id) return;
  VisualAPI.updateJsonDate({id: params.id, dashboard_name: val})
    .then(({ data: result }) => {
      if (result.code === 200) {
        message.success('名称修改成功');
      }
    })
}

const EditEdgeMode =useIsEditEdgeMode()
const changeEditEdgeMode=()=>{
  EditEdgeMode.increment()

}

onMounted(() => {
  let canvasConfig: ICanvasConfig = CanvasConfig.getInstance();
  const events: ICellEvents = canvasConfig.getEvents();

  events.setGraphScaleEventListener((data: any) => {
      state.scaling = Number((data.sx * 100).toFixed(0));
  });
  zoomToFit();
  getUserInfo();
  autoSave(params?.id)
});
  

const fileList = ref([]);
const handleChange = (uploadFile: any) => {
  const raw = uploadFile.raw;
  readFile(raw)
    .then(result => {
      importJSON(result);
    });
}

const handleClickExport = () => {
    const json = toJSON();

    exportFile("data.json", JSON.stringify(json, null, 4));
}

const handleCommandExport = (command: string) => {
    switch (command) {
        case 'json':
            const json = toJSON();
            exportFile("data.json", JSON.stringify(json, null, 4));
            break;
        case 'svg':
            exportSVG();
            break;
        case 'png':
            exportPNG();
            break;
        case 'jpeg':
            exportJPEG();
            break;
        default:
            break;
    }
}

const getUserInfo = () => {
  setInterval(() => {
    const json = toJSON();
    AuthAPI.refreshToken({}).then(res => {
      
    })
  }, 1000 * 30)
}


const handleDBClick = () => {
}

</script>

<style lang="scss" scoped>
.example-showcase .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }

  :deep(.el-button--primary) {
    color: #606266!important;
  }
  .example-showcase .el-dropdown-link {
    cursor: pointer;
    color: #606266;
    display: flex;
    align-items: center;
  }
  :deep(.el-dropdown) {
    height: 32px;
    margin: 0px 0px 0px 12px;
    padding: 8px 15px;
    align-items: center;
    font-size:  var(--el-font-size-base);
  }
  .el-dropdown-link:focus-visible {
    outline: -webkit-focus-ring-color auto 0px;
  }

  .saving-state {
    color: #a3a4a7;
    font-size: 14px;
    margin-left: 12px;
    margin-top: 14px;
  }
.editAlert{
  position: absolute;
  top:70px;
  color: #DD4A68;
  font-size: 12px;
  padding:8px;
  width: calc(100vw - 600px);
  margin-left:300px;
  margin-right:300px
}


.head_tools::-webkit-scrollbar {
  width: 5px;
  height: 5px;

}
.head_tools::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.8);
}
.head_tools::-webkit-scrollbar-track {
  border-radius: 0;
  background: rgba(0,0,0,0.8);
}
:deep .input-name {
  .el-input__wrapper {
    box-shadow: none;
  }
  .is-focus {
    box-shadow:  0 0 0 1px var(--el-input-border-color,var(--el-border-color)) inset;
  }
}
</style>
