<template>
  <div id="displayContainer" style="width:100vw;height:100vh">
    <div :id="Common.DEFAULT_DISPLAY_CONTAINER_ID"></div>
    <TeleportContainer />
  </div>
  <div v-if="!isFullScreen" class="display-tools-container" style="position: absolute">
    <!-- <el-button v-if="!isFullScreen" @click="fullScreen">全屏</el-button> -->
    <el-dropdown @command="handleToolsCommand">
      <el-button :icon="More" size="small" round />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="fullScreen">全屏</el-dropdown-item>
          <el-dropdown-item command="fit">自适应</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from "vue";
import * as Common from "@/common";
import { useDisplay } from "./useDisplay"
import { getTeleport } from "@antv/x6-vue-shape";
import { parseParams } from "@/utils";
import { CanvasConfig } from "@/editor/config";
import { More } from "@element-plus/icons-vue";
import { useRoute } from 'vue-router';
import VisualAPI from "@/api/visual";
import { useAuthStore } from '@/store';
import { Websocket } from "@/utils/Websocket";


const TeleportContainer = getTeleport();

let { initDisplay, screenName } = useDisplay(Common.DEFAULT_DISPLAY_CONTAINER_ID);
document.title = '可视化查看 - ThingsPanel - ' + screenName.value;
const params = parseParams();
const route = useRoute();
let shareId = ref();
shareId.value = route.params.shareId;

onMounted(() => {
  console.debug("mounted", params, this, route, shareId.value)
  let ws: IWebsocket = new Websocket("9ebad5c8-38f2-81eb-55a4-1c84d7266248");
  ws.onReady(() => {
    console.log("ws连接成功")
    // ws.send({ type: "ping" })
  });
  ws.onMessage((data: any) => {
    console.log("ws", data)

  })
  let jsonData: any = "";
  let dashboardId = params?.id;

  // 存在分享id时，请求对应可视化id
  if (shareId.value) {
    useAuthStore().setShareTokenInfo(shareId.value);
    VisualAPI.getSharedDashboard(
      { id: shareId.value }
    ).then(({ data }) => {
      if (data.code === 200) {
        dashboardId = data.data.dashboard_id;
        initDisplay(jsonData, dashboardId, shareId.value);
      }
    });
  } else {
    // 本地预览模式
    if (params?.mode === 'preview') {
      jsonData = sessionStorage.getItem(Common.PREVIEW_JSON_DATA_KEY);
      initDisplay(jsonData);
    // 正式环境预览模式
    } else {
      initDisplay(jsonData, dashboardId);
    }

  }

});

const containerRect = ref({
  width: 1920,
  height: 1080
});

onMounted(() => {
  const resizeObserver = new ResizeObserver(entries => {
    console.log("监听变化", entries[0].contentRect.width, entries[0].contentRect.height)
    const options: ICanvasConfig.Options = {
      screenRect: {
        width: entries[0].contentRect.width,
        height: entries[0].contentRect.height
      }
    }
    CanvasConfig.getDisplayInstance(Common.DEFAULT_DISPLAY_CONTAINER_ID, options).zoomToFit();
  })
  const displayContainer: HTMLElement = <HTMLElement>document.getElementById(Common.DEFAULT_DISPLAY_CONTAINER_ID);
  resizeObserver.observe(displayContainer);
  
  const canvasConfig: ICanvasConfig = CanvasConfig.getDisplayInstance(Common.DEFAULT_DISPLAY_CONTAINER_ID);
  const events: ICellEvents = canvasConfig.getEvents() 
  events.setMountedEventListener((data: any) => {
    console.log("mounted", data)
    // containerRect.value = data.containerRect;
  })
})

function handleToolsCommand(command: string) {
  const canvasConfig: ICanvasConfig = CanvasConfig.getDisplayInstance(Common.DEFAULT_DISPLAY_CONTAINER_ID);
  switch (command) {
    case "fullScreen":
      fullScreen();
      canvasConfig.zoomToFit();
      break;
    case "fit":
      canvasConfig.zoomToFit();
      break;
  }
}

let isFullScreen = ref<any>(false);
function fullScreen() {
  if (!isFullScreen.value) {
    document.documentElement.requestFullscreen()
    isFullScreen.value = true;
  }
}
function screenChange() {
  document.fullscreenElement ? isFullScreen.value = true : isFullScreen.value = false
}
document.addEventListener("fullscreenchange", screenChange , true);

</script>

<style lang="scss" scoped>
:deep(.x6-port.x6-port-link) {
  // 隐藏连接桩
  display: none;
}

.display-tools-container {
  position: absolute;
  top: 10px;
  left: 5px;
}
</style>@/utils/Websocket.js