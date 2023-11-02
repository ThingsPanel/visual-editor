/*
 * @Author: chaoxiaoshu-mx leukotrichia@163.com
 * @Date: 2023-11-02 09:49:23
 * @LastEditors: chaoxiaoshu-mx leukotrichia@163.com
 * @LastEditTime: 2023-11-02 16:03:11
 * @FilePath: \tp-editor\src\editor\hooks\useCanvas.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { CanvasConfig } from '../config';
import * as Common from '@/common';
import { usePlugins, useStencil } from '.';
import { getDropPicComponent } from '../components/canvas-editor/DropPicComponent';
import { getPicAttrComponent } from '../components/right-attribute-panel/components/PicAttr';
import { VisualAPI, PluginAPI, MarketAPI } from '@/api';
import { isJSON } from '@/utils';
import { ref, provide } from 'vue';
import { useDeviceIdStore } from "@/store/modules/deviceIdStore"


const localUrl = import.meta.env.VITE_BASE_URL  || document.location.origin;
const oss = import.meta.env.VITE_OSS
/**
 * @author cxs
 * @date 2023-04-28
 * @update 2023-05-24
 * @description 初始化画布
 * @param data 
 */
const useCanvas = (id?: any): any => {
    const { loadPlugins } = usePlugins();

    const screenName = ref<string>("");
    /*
        1. 节点拖拽到画布时把所属插件url存入节点
        2. 画布渲染时根据节点所属插件url加载插件
    */

    const initCanvas = async () => {
        // 获取画布管理器
        let canvasConfig: ICanvasConfig = CanvasConfig.getInstance(Common.DEFAULT_CONTAINER_ID);

        loadPlugins(async () => {
            if (id) {
                // 全局存储设备id
                useDeviceIdStore().setDeviceId(id)
                
                let { data: result } = await VisualAPI.getJsonDataById({ id, current_page: 1, per_page: 10 })
                if (result.code === 200) {
                    screenName.value = result.data?.data?.[0].dashboard_name;
                    let jsonData = result.data?.data?.[0]?.json_data;
                    const jsonObj = isJSON(jsonData);
                    console.log('plugin.importJSON', jsonObj)
                    localStorage.removeItem(Common.STORAGE_JSON_DATA_KEY);
                    if (jsonObj) {
                        canvasConfig.renderJSON(jsonObj);
                        canvasConfig.center();
                    }
                }
            } else {
                let storageJson = localStorage.getItem(Common.STORAGE_JSON_DATA_KEY);
                if (storageJson) {
                    const jsonObj = isJSON(storageJson);
                    console.log('useCanvas.storageJson', jsonObj)
                    if (jsonObj) {
                        canvasConfig.renderJSON(jsonObj);
                        canvasConfig.center();
                    }
                }
            }
            const edges=canvasConfig.graph.getEdges()
            if(edges.length > 0) {
                edges.forEach((edge:any) => {
                    console.log(edge.attr('targetData'),"54938590342859032485934825")
                    if(edge?.attr('targetData')?.flowEffect!=="无效果"){
                        canvasConfig.edgeAnimation(edge,edge.attr('targetData'))
                    }
                })
            }
        })
    }

    return {
        initCanvas, screenName
    }
}

export { useCanvas }
