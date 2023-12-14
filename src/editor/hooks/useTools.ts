import { Cell } from "@antv/x6";
import { CanvasConfig,StencilConfig } from "../config"
import { useRouter } from "vue-router";
import VisualAPI from "@/api/visual";
import { MarketApi } from "@/api/market"
import { exportFile, isJSON, message } from "@/utils/tool";
import * as Common from "@/common"
import { reactive, ref } from "vue";
import Clipboard from 'clipboard'
import { dateFormat } from "@/utils";
import { useMarketStore } from "@/store"
/**
 * @author cxs
 * @date 2023-04-20
 * @update 2023-05-18 新增预览、分享
 * @description 工具栏
 * @interface ITools
 * @returns 
 */
export const useTools = (): ITools => {
    const router = useRouter();
    const state = reactive<{
        scaling: Number,
        savingState: String,
        visualName: String,
        publishVisible: Boolean,
        shareVisible: Boolean,
        marketVisible: Boolean
    }>({
       scaling: 100,
       savingState: "",
       visualName: "",
       publishVisible: false,
       shareVisible: false,
       marketVisible: false
    })
    const savingState = ref("");

    // 测试线条的颜色修改工具;  *@author; 王炳宏  2023-05-23
    function setLineStyle(eid: any, nid: any, data: any) {
        CanvasConfig.getInstance().onChangeEdges(eid,nid,data);
    };

    function zoomToFit() {
        state.scaling = CanvasConfig.getInstance().zoomToFit();
    };
    function getZoom() {
        return state.scaling;
    };
    function zoomOut() {
        state.scaling = CanvasConfig.getInstance().zoomOut();
    };
    function zoomIn() {
        state.scaling = CanvasConfig.getInstance().zoomIn();
    };
    function enableSnapline() {
        CanvasConfig.getInstance().enableSnapline();
    };
    function disableSnapline() {
        CanvasConfig.getInstance().disableSnapline();
    };
    function undo() {
        CanvasConfig.getInstance().undo();
    };
    function redo() {
        CanvasConfig.getInstance().redo();
    };
    function toJSON(): { cells: Cell.Properties[] } | { graph: any }  {
        
        return CanvasConfig.getInstance().toJSON();
    };
    function importJSON(jsonData: any)  {
        const jsonObj = isJSON(jsonData);
        const instance= CanvasConfig.getInstance()
        if (jsonObj) {
            instance.renderJSON(jsonObj);
        }
        const  theg = instance.getGraph()
        if(theg){
        const Edges=theg.getEdges()
        Edges.forEach((edge:any)=>{
            instance.edgeAnimation(edge,edge.attr('targetData'))
        })
        }
    };
    function exportJPEG(fileName?: string, options?: any) {
        CanvasConfig.getInstance().exportJPEG(fileName, options);
    };
    function exportPNG(fileName?: string, options?: any) {
        CanvasConfig.getInstance().exportPNG(fileName, options);
    };
    function exportSVG(fileName?: string, options?: any) {
        CanvasConfig.getInstance().exportSVG(fileName, options);
    };
    function preview() {
        // 获取大屏数据
        const instance= CanvasConfig.getInstance()
        const nodes=  instance.graph?.getNodes()
        nodes?.forEach((node)=>{
            const ports=node.getPorts()
            ports.forEach((port:any) => {
                node.portProp(port.id, "attrs/circle/style/visibility", "hidden");
            })
        })
        const jsonData =instance.toJSON();
        // 大屏数据存入session
        sessionStorage.setItem(Common.PREVIEW_JSON_DATA_KEY, JSON.stringify(jsonData));
        const url = router.resolve({
            name: 'display',
            query: {
                mode: 'preview'
            }
        })
        window.open(url.href);
    };
    function help() {
        window.open('http://thingspanel.io/zh-Hans/docs/overview');
    };
    async function publishScreen() {
        const json = CanvasConfig.getInstance().toJSON()
        let isLogined = await useMarketStore().loginStatus()
        if (isLogined) {
            let result = await MarketApi.addScreen({ json: JSON.stringify(json), zh_name: "大屏3", icon: "market/assets/JRnRJwJJ0aD2U_2TPrA1J_230817100925.png"});
        } else {
            message.success('未登录插件市场!')
        }
    };
    function share(params: any) {
        const url = router.resolve({
            name: 'display',
            query: {
              id: params.id,
              token: params.token,
              expiresTime: params.expiresTime
            }
        })
        var clipboard = new Clipboard('#share-btn', {
            text:function(){
                return `${location.origin}${url.href}`
            },
        });
        clipboard.on('success', () =>{
            message.success('分享链接已复制到粘贴板')
        });
 
    };
    function autoSave(id: string) {
        setInterval(() => {
            save(id);
        }, Common.AUTO_SAVE_INTERVAL);
    };
    function save(id: string, jsonData?: any) {
        if (!id) return;
        const json =  jsonData || CanvasConfig.getInstance().toJSON();
        VisualAPI.updateJsonDate({id, json_data: JSON.stringify(json)})
            .then(({ data }) => {
                if (data.code === 200) {
                    const timeStamp = Date.parse(new Date());;
                    const fmtTime = dateFormat(timeStamp);
                    savingState.value = fmtTime.slice(-8) + " 已保存";
                }
            });
    };
    return {
        state, savingState,  setLineStyle, zoomToFit, getZoom, zoomOut, zoomIn, enableSnapline, disableSnapline,undo, 
        redo, toJSON, importJSON, exportJPEG, exportPNG, exportSVG, preview, help, share, autoSave, save, publishScreen
    }
}
