import {ref, shallowRef, toRaw, watch, inject, defineComponent, h} from "vue";
import { CanvasConfig, PluginConfig } from "@/editor/config";
import { isJSON } from "@/utils";
import {uniqWith,isEqual,filter}  from "lodash"
import { useTools } from "@/editor/hooks"
import * as Common from "@/common";
import {useIsEditEdgeMode} from "@/store/modules/isEditEdgeaModeStore";
import {  Node, Edge, EdgeView } from '@antv/x6'
import { useIs3DMode } from '@/store/modules/is3DStroe';



/**
 * @author cxs
 * @date 2023-05-20
 * @update 2023-05-20
 * @description 事件管理
 * @returns
 */

export const useEvents = () => {
    // 当前点击的是节点还是画布
    let isNode = ref<any>(false);
    // 当前点击的是否是边
    let isEdge = ref<any>(false);
    // 当前点击的节点
    // let currentNode = ref<any>(null);
    let currentNode: any = null;
    // 当前节点的Attribute组件
    let attributeCpt = shallowRef<any>(null);
    // 当前节点的Data组件
    let dataCpt = shallowRef<any>(null);
    // 当前节点的组件
    let component: any = {};
    // 当前节点的数据
    let haveToolNode = ref<any>(null);
    let nodeData = ref<any>({});
    let edgeData = ref<any>({});
    let nodeId = ref<any>(null)
    let cellList =  ref<any>([])
    let container =  ref<any>(HTMLDivElement)
    const params: any = inject('params', null);
    /**
     * 初始化事件
     * @returns
     */
    const EditEdgeMode = useIsEditEdgeMode();

    const is3DMode=useIs3DMode()
    const initEvents = () => {
        let canvasConfig: ICanvasConfig = CanvasConfig.getInstance();
        const events: ICellEvents = canvasConfig.getEvents();
        const graph = canvasConfig.getGraph()
        container = graph.container as HTMLDivElement

        // 新增节点事件
        events.setNodeAddEventListener((data: any) => {
            console.log('setNodeAddEventListener', data)
            storageGraphData();
        });
        //画线相关函数
        let editEdge: Edge | null = null
        let editNode: Node | null = null

//开始画线

        const init = (pos: { x: number; y: number }) => {
            editNode = graph.addNode({
                shape: 'circle',
                width: 0,
                height: 0,
                ...pos,
            })
            editEdge = graph.addEdge({
                source: pos,
                target: pos,
                attrs: {
                    line: {
                        targetMarker: null,
                        stroke: '#A2B1C3',
                        strokeWidth: 2,
                        sourceMarker: null,
                    },
                },
            })
        }
        const addVertices = (pos: { x: number; y: number }) => {
            if (editEdge) {
                editEdge.appendVertex(pos)
            }
        }
        const onMouseMove = (e: MouseEvent) => {
            if (editEdge) {
                const pos = graph.clientToLocal(e.clientX, e.clientY)
                editEdge.setTarget(pos)
            }
        }
        const print = () => {
            if (editEdge) {
                const view = graph.findViewByCell(editEdge) as EdgeView
            }
        }
        const finish = (closed: boolean) => {
            console.log(1)
            if (editNode && editEdge) {
                console.log(11)
                const vertices = editEdge.getVertices()
                if (closed) {
                    console.log(111)
                    if (vertices.length >= 2) {
                        console.log(1111)
                        const center = editNode.getBBox().center
                        editEdge.setSource(center)
                        editEdge.setTarget(center)
                        graph.removeNode(editNode)
                        editNode = null
                    } else {
                        console.log(11112)
                        graph.removeCells([editNode, editEdge])
                        editNode = null
                        editEdge = null
                    }
                } else {
                    console.log(112)
                    if (vertices.length >= 1) {
                        console.log(1121)
                        const center = editNode.getBBox().center
                        editEdge.setSource(center)
                        editEdge.setTarget(vertices[vertices.length - 1])
                        graph.removeNode(editNode)
                        editNode = null
                    } else {
                        console.log(1122)
                        graph.removeCells([editNode, editEdge])
                        editNode = null
                        editEdge = null
                    }
                }
                editNode = null
                console.log(1,EditEdgeMode.isEditEdgeMode)
                EditEdgeMode.setFalse()

                console.log(2, EditEdgeMode.isEditEdgeMode)
                container.removeEventListener('mousemove', onMouseMove)
            }
        }
        watch(() => EditEdgeMode.isEditEdgeMode,(newValue, oldValue) => {
            if(!newValue){
                finish(false)
            }
        })


        graph.on('edge:contextmenu', (e: any, v1: any, v2: any) => {
            finish(false)
        })

        const menu = {
            render() {
                return  h('div', 'hello')
            }
        }

        // 点击node
        events.setClickEventListener((data: any) => {
            console.log('setClickEventListener', data)
            const temp = data.node || data.cell || null;
            // 节点工具
            // setNodeTools(temp, currentNode,graph);
            currentNode = temp;

            if (temp === null) {
                // 如果点击的是画布
                is3DMode.setFalse()
                isNode.value = false;
                isEdge.value=false;
                nodeData.value = {};

                if(EditEdgeMode.isEditEdgeMode){
                    console.log("开始画线")
                    init({ x:data.x, y:data.y })
                    container.addEventListener('mousemove', onMouseMove)
                }
                console.log('如果点击的是画布')
                return;
            }

            nodeId = currentNode?.id

            if(currentNode.shape.indexOf("ThreeJs")==-1){
                is3DMode.setFalse()
            }
            // 获取插件管理器
            console.log('initEvents.PluginConfig.getInstance()')
            const pluginConfig: IPluginConfig = PluginConfig.getInstance();
            // 通过节点名称获取组件
            component = pluginConfig.getComponent(currentNode.shape);
            // 节点的附加数据
            nodeData.value = currentNode.store.data ;
            console.log('initEvents.nodeData', nodeData.value)
            if (component) {
                // 自定义组件
                setNodeData(data);
                isNode.value = true;
                isEdge.value=false;
                // 当前组件的Attribute组件
                attributeCpt.value = component.Attribute;
                // 当前组件的Data组件
                dataCpt.value = component.Data;
                
            } else {
                // 连线或基础节点
                if(currentNode.shape==='edge'){
                    console.log(currentNode.shape,"这是边：",currentNode.id,)
                    if(EditEdgeMode.isEditEdgeMode){
                        const nodes = graph.getNodesFromPoint(data.x, data.y)
                        if (nodes.length && nodes[0] === editNode) {
                            finish(true)
                        } else {
                            addVertices({ x:data.x, y:data.y })
                        }
                    }else{
                        //如果点击的是边 ;  *@author; 王炳宏  2023-05-23
                        graph.clearTransformWidgets();
                        dataCpt.value = null;
                        isEdge.value=true;
                        isNode.value=false
                        setEdgeData(data)
                        // currentNode.attr('line/stroke','#7e14ff')
                        console.log(isEdge.value)
                    }
                } else {
                    // 基础节点
                    isNode.value = true;
                    attributeCpt.value = null;
                    dataCpt.value = null;

                }
            }
        });

        events.setResizedEventListener((data: any) => {
            console.log('setResizedEventListener')
            const temp = data.node || data.cell || null;
            currentNode = temp;
            setNodeData(data);
            storageGraphData();
        });

        events.setMovedEventListener((data: any) => {


            const temp = data.node || data.cell || null;
            currentNode = temp;
            setNodeData(data);
            storageGraphData();
        });

        events.setMountedEventListener((view) => {
            setCellList(view,true)
        });
        events.setUnmountedEventListener((view) => {

            setCellList(view,false)
            if(cellList.value.length===0){
                isNode.value = false;
                isEdge.value=false;
                nodeData.value = {};
                return;
            }
        });

        events.setMouseEnterEventListener((data: any) => {
            const node = data.cell;
            if(node.shape!=='edge'&&node.shape!=='rect_img'){
                const ports=node.getPorts()
                ports.forEach((port:any) => {
                    node.portProp(port.id, "attrs/circle/style/visibility", "visible");
                })
            }
        });

        events.setMouseLeaveEventListener((data: any) => {
            const node = data.cell;
            if(node.shape!=='edge'&&node.shape!=='rect_img'){
                const ports=node.getPorts()
                ports.forEach((port:any) => {
                    node.portProp(port.id, "attrs/circle/style/visibility", "hidden");
                })
            }

        });

    }

    const setNodeData = (data: any) => {
        const node = data.node || data.cell || null;
        if (node !== null) {
            nodeData.value = { ...node.store.data };
        }
    }

    const setCellList = (data: any,flag:boolean,) => {
        if(flag){
            cellList.value=uniqWith([...cellList.value,data],isEqual)
        }else{

            cellList.value= filter(cellList.value,(n:any)=>{
                return n.view.cell.id!==data.view.cell.id
            })
        }

    }

    const setEdgeData = (data: any) => {
        const edge =  data.node || data.cell || null;
        // console.log('edges', edge)
        if (edge !== null) {
            edgeData.value = { ...edge.store.data };
            console.log('setEdgeData', edgeData.value)
        }
    }

    let { save } = useTools();
    // 画布上的内容有改动时，将内容存入浏览器缓存中
    const storageGraphData = () => {
        const canvasConfig: ICanvasConfig = CanvasConfig.getInstance();
        console.log('storageGraphData.parama.id', params.id)
        setTimeout(() => {
            const json = canvasConfig.toJSON();
            localStorage.setItem(Common.STORAGE_JSON_DATA_KEY, JSON.stringify(json));
            save(params?.id);
        }, 200);
    }

    /**
     * 用户自定义组件的样式和绑定的数据改变后，会调用这个方法，更新画布上的节点数据
     * @param dataT
     */
    const onChange = (data: any) => {
        console.log('useEvents.onChange1', data)
        let jsonStr = "{}";
        if (currentNode?.getData()) {
            // 从节点的附加数据中获取JSON字符串
            jsonStr = currentNode.getData()?.jsonData || "{}";

        }
        const jsonObj = isJSON(jsonStr);

        if (data?.style) {
            jsonObj.style = { ...data.style };
        }



        if (data?.data) {
            jsonObj.data = { ...data.data };
        }
        // 因为antv-x6的setData暂不支持Array，所以这里只能用JSON字符串来存储数据
        const jsonData = JSON.stringify(jsonObj);
        console.log('useEvents.onChange', jsonData)
        // 更新节点的附加数据，写入JSON字符串

        currentNode.setData({
            // ...currentNode.getData(),
            jsonData
        });

        // 基础图形
        const baseNodes = ["rect", "circle", "ellipse", "polygon", "polyline", "rect_img"];
        const index = baseNodes.findIndex((item: string) => item === currentNode.shape)
        if (index !== -1) {
            if(data?.style) {
                if(currentNode.shape!=='rect_img'){

                    console.log('基础图形', data.style.body)
                    // 基础图形
                    currentNode.attr('body', { ...data.style.body })
                    console.log('基础图形', currentNode)
    
                }else{
                    // 图片组件
                    currentNode.attr('image', {...data.style.image} )
                    currentNode.attr('image/xlink:href',data.style.image.xlink )
                }
            }
        }
        console.log('useEvents.onChange.storageGraphData', currentNode)
        storageGraphData();
    }

    /**
     * 基础属性改变时（位置、大小、层级），更新画布上的节点数据
     * @param data
     */
    const onBaseChange = (data: any) => {
        console.log('onBaseChange', data)
        if(!data?.baseStyle) return
        data.baseStyle.size && currentNode.resize(Number(data?.baseStyle?.size?.width), Number(data?.baseStyle?.size?.height));
        data.baseStyle.position && currentNode.position(Number(data?.baseStyle?.position?.x), Number(data?.baseStyle?.position?.y));
        data.baseStyle.zIndex && currentNode.setZIndex(data?.baseStyle?.zIndex);
    }

    const setNodeTools = (newNode: any, oldNode: any,graph:any) => {
        if (oldNode) {
            // 删除旧节点的工具
            oldNode.removeTools();
        }
        if(haveToolNode.value){
            haveToolNode.value.removeTools();
        }
        if (newNode) {
            // 添加新节点的工具
            haveToolNode.value=newNode
            if(EditEdgeMode.isEditEdgeMode) return
            newNode.addTools({
                name: 'button-remove',
                args: {
                    x: '100%',
                    y: 0,
                    offset: { x: 10, y: -10 },
                },
            })
        }
    }

    return {
        isNode, attributeCpt, dataCpt, nodeData,isEdge,nodeId,edgeData,
        initEvents, onChange, onBaseChange, cellList
    }
}



