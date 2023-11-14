<!--
 * @Author: chaoxiaoshu-mx leukotrichia@163.com
 * @Date: 2023-11-13 19:42:21
 * @LastEditors: chaoxiaoshu-mx leukotrichia@163.com
 * @LastEditTime: 2023-11-14 19:41:14
 * @FilePath: \tp-editor\src\editor\ContextMenu.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="context-menu" v-if="visible" :style="{ left: `${pos.x}px`, top: `${pos.y}px` }">
        <ul>
            <li :class="cell?.id?'':'disabled'" @click="cell?.id?handleMenuItemClick('top'):null">置顶</li> <!-- 置顶 -->
            <li :class="cell?.id?'':'disabled'" @click="cell?.id?handleMenuItemClick('bottom'):null">置底</li> <!-- 置底 -->
            <li :class="cell?.id?'':'disabled'" @click="cell?.id?handleMenuItemClick('up'):null">上移</li> <!-- 上移 -->
            <li :class="cell?.id?'':'disabled'" @click="cell?.id?handleMenuItemClick('down'):null">下移</li> <!-- 下移 -->
            <li class="divider"></li> <!-- 分隔线 -->
            <li :class="cell?.id?'':'disabled'" @click="cell?.id?handleMenuItemClick('delete'):null">删除<span class="menu-shortcut">backspace</span></li> <!-- 删除 -->
            <li class="divider"></li> <!-- 分隔线 -->
            <li :class="cell?.id?'':'disabled'" @click="cell?.id?handleMenuItemClick('copy'):null">复制<span class="menu-shortcut">Ctrl + C</span></li> <!-- 复制 -->
            <li @click="handleMenuItemClick('paste')">粘贴<span class="menu-shortcut">Ctrl + V</span></li> <!-- 粘贴 -->
          </ul>
    </div>
</template>

<script setup lang="ts">
import { Cell } from '@antv/x6';
import { CanvasConfig } from './config';

const props = defineProps({
    // 显示/隐藏菜单
    visible: {
        type: Boolean,
        default: false
    },
    cell: {
        type: Object,
        default: () => ({})
    },
    // 菜单位置
    pos: {
        type: Object,
        default: ({ x: 0, y: 0 })
    }
});
const emit = defineEmits(["update:visible"]);
/**
 * @description: 点击菜单项
 * @param {*} item
 * @return {*}
 */
function handleMenuItemClick(item: string) {
    const canvasConfig: ICanvasConfig = CanvasConfig.getInstance();
    switch (item) {
        case "top": {
            // 置顶
            const obj = canvasConfig.getMinMaxZIndex();
            (<Cell>props.cell).setZIndex(obj.max + 1);
            break;
        }
        case "bottom": {
            // 置底
            const obj = canvasConfig.getMinMaxZIndex();
            (<Cell>props.cell).setZIndex(obj.min - 1);
            break;
        }
        case "up": {
            // 上移
            const zIndex = canvasConfig.getUpperLayerZIndex(props.cell);
            (<Cell>props.cell).setZIndex(zIndex);    
            break;
        }
        case "down": {
            // 下移
            const zIndex = canvasConfig.getLowerLayerZIndex(props.cell);
            (<Cell>props.cell).setZIndex(zIndex);    
            break;
        }
        case "delete": {
            // 删除
            canvasConfig.delete(props.cell);
            break;
        }
        case "copy": {
            // 复制
            canvasConfig.copy(props.cell);
            break;
        }
        case "paste": {
            // 粘贴
            canvasConfig.paste();
            break;
        }
    }
    // 关闭菜单
    emit("update:visible", false)
}
</script>

<style lang="scss" scoped>
/* 右键菜单容器的样式 */
.context-menu {
    position: absolute;
    z-index: 1000;
    width: 160px;
    background-color: white;
    border: 1px solid #ddd;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    overflow: hidden;
    /* 单个菜单项的样式 */
    li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        list-style: none;
        padding: 8px 15px;
        margin: 0;
        font-size: 14px;
        color: #333;
        cursor: pointer;
        white-space: nowrap;
        /* 快捷键样式 */
        .menu-shortcut {
            margin-left: auto;
            opacity: 0.7;
        
        }
        
    }
    /* 鼠标悬停在菜单项上时的样式 */
    li:hover {
        background-color: #f5f5f5;
    }
    /* 菜单项之间的分隔线 */
    li.divider {
        border-bottom: 1px solid #ddd;
        margin: 0;
        padding: 0;
        height: 0; /* 使得分隔线没有额外的高度 */
    }
    li.disabled {
        color: #ccc;
        cursor: not-allowed;
    }
}
  
  
  
  
  
  
  
</style>