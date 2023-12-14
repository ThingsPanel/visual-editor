import { Graph,Edge,Node,ToolsView } from "@antv/x6";
import * as Common from "@/common";
import { watch } from 'vue';
import {useIsEditEdgeMode} from "@/store/modules/isEditEdgeaModeStore"

import {DEFAULT_CONTAINER_ID} from "@/common";



/**
 * 事件处理
 */
class CellEvents implements ICellEvents {

    graph: Graph | undefined;
    isDrawLine:boolean = false
    container: HTMLElement | SVGElement| undefined;

    graphScaleListener: EventListener[] = [];

    nodeAddListener: EventListener | undefined;

    clickListener:  EventListener[] = [];

    dbClickListener: EventListener | undefined;

    mouseEnterListener: EventListener | undefined;

    mouseLeaveListener: EventListener | undefined;

    movedListener: EventListener | undefined;

    contextMenuListener: EventListener | undefined;

    resizeListener: EventListener | undefined;

    resizedListener: EventListener | undefined;

    mountedListener: EventListener | undefined;

    unmountedListener: EventListener | undefined;

    removedListener: EventListener | undefined;

    constructor(graph: Graph,isDrawLine:boolean) {
        this.graph = graph;
        this.isDrawLine=isDrawLine
        this.container = <HTMLDivElement>document.getElementById(Common.DEFAULT_CONTAINER_ID);
        this.initEvents();
    }

    initEvents(): void {
        let isMove=false
        if (!this.graph)
            throw new Error('Graph is undefined.');
        let edge: Edge | null = null
        let node: Node | null = null

        const EditEdgeMode = useIsEditEdgeMode();

        // 画布缩放事件
        this.graph.on("scale", ({ sx, sy, ox, oy  }) => {
            this.graphScaleListener.forEach((listener) => {
                listener({ sx, sy, ox, oy });
            })
        });

        // this.graph.on("blank:click", ({ e, x, y }) => {
        //    if(!EditEdgeMode.isEditEdgeMode) return
        //     console.log(EditEdgeMode.isEditEdgeMode)
        // });

        this.graph.on("blank:mousedown", ({ e, x, y }) => {
            this.clickListener.forEach((listener) => {
                listener({ e, x, y });
            })
        });

        this.graph.on("blank:contextmenu", ({ e, x, y }) => {
            // this.clickListener.forEach((listener) => {
            //     listener({ e, x, y });
            // })
        });

        this.graph.on("cell:added", ({ cell, index, options }) => {
            this.nodeAddListener && this.nodeAddListener({ cell, index, options });
        });

        // 单击事件 
        this.graph.on("cell:click", ({ e, x, y, cell, view }) => {

            e.stopPropagation()
            this.clickListener.forEach((listener) => {
                listener({ e, x, y, cell, view });
            })
        });

        // 节点双击事件
        this.graph.on("cell:dblclick", ({ e, x, y, cell, view }) => {
            this.dbClickListener && this.dbClickListener({ e, x, y, cell, view });
        });

        // 节点移入事件
        this.graph.on("cell:mouseenter", ({ e, cell, view }) => {
            this.mouseEnterListener && this.mouseEnterListener({ e, cell, view });
        });
        
        //节点被挂载到画布上时触发。
        this.graph.on("view:mounted", ({ view }) => {
            this.mountedListener&& this.mountedListener({  view });
        });


        //节点从画布上卸载时触发。
        this.graph.on("view:unmounted", ({ view }) => {

            this.unmountedListener&& this.unmountedListener({  view });

        });

        // 节点移出事件
        this.graph.on("cell:mouseleave", ({ e, cell, view }) => {
            this.mouseLeaveListener && this.mouseLeaveListener({ e, cell, view });
        });

        // 节点移动事件
        this.graph.on("node:moved", ({ e, x, y, node, view }) => {

            e.stopPropagation()
            this.movedListener && this.movedListener({ e, x, y, node, view });
        });
        
        // 边移动事件
        this.graph.on("edge:moved", ({ e, x, y, edge, view }) => {
            this.movedListener && this.movedListener({ e, x, y, node: edge, view });
        });

        // 右键菜单事件
        this.graph.on("cell:contextmenu", ({ e, x, y, cell, view }) => {

            this.contextMenuListener && this.contextMenuListener({ e, x, y, cell, view });
        });

        // 节点大小改变事件
        this.graph.on("node:resize", ({ e, x, y, node, view }) => {
            this.resizeListener && this.resizeListener({ e, x, y, node, view });
        });

        this.graph.on("node:resized", ({ e, x, y, node, view }) => {
            this.resizedListener && this.resizedListener({ e, x, y, node, view });
        });

        this.graph.on("cell:added", ({  cell, index, options  }) => {
        });

        this.graph.on("cell:removed", ({  cell, index, options  }) => {

        });

        this.graph.on("cell:changed", ({ cell, options }) => {
        });

        this.graph.on('edge:selected', ({ edge }) => {
            console.log(EditEdgeMode.isEditEdgeMode,"43243243243")
            if(EditEdgeMode.isEditEdgeMode) return
            edge.addTools([ { name: "segments" ,args:{stopPropagation:false,}},{ name: "vertices" ,args:{stopPropagation:false,}}, { name: "target-arrowhead" ,args:{stopPropagation:false}},  { name: "source-arrowhead" ,args:{
                    attrs: {
                        d: `
                        M 0,0
                        m -8,0
                        a4,4 0 1,0 8,0
                        a4,4 0 1,0 -8,0
                        `,
                        fill: 'rgba(0,0,0,0)',
                        stroke: '#282828',
                        'stroke-width':2,
                        cursor: 'move',
                    },
                }}])
        })

        this.graph.on('edge:unselected', ({ edge }) => {
            edge.removeTools()
        })

        this.graph.on('cell:removed', ({ cell }) => {

            this.removedListener && this.removedListener({ cell });
        })

    }

    public setGraphScaleEventListener(listener: EventListener): void {
        this.graphScaleListener.push(listener);
    }

    public setNodeAddEventListener(listener: EventListener): void {
        this.nodeAddListener = listener;
    }

    public setClickEventListener(listener: EventListener): void {
        if (this.clickListener.includes(listener))
            return;
        this.clickListener.push(listener);
    }

    public setDBClickEventListener(listener: EventListener): void {
        this.dbClickListener = listener;
    }

    public setMouseEnterEventListener(listener: EventListener): void {
        this.mouseEnterListener = listener;
    }

    public setMouseLeaveEventListener(listener: EventListener): void {
        this.mouseLeaveListener = listener;
    }

    public setMovedEventListener(listener: EventListener): void {
        this.movedListener = listener;
    }

    public setContextMenuEventListener(listener: EventListener): void {
        this.contextMenuListener = listener;
    }

    public setResizeEventListener(listener: EventListener): void {
        this.resizeListener = listener;
    }

    public setResizedEventListener(listener: EventListener): void {
        this.resizedListener = listener;
    }
    public setMountedEventListener(listener: EventListener): void {
        this.mountedListener = listener;
    }
    public  setUnmountedEventListener(listener: EventListener): void {
        this.unmountedListener = listener;
    }

    public setRemovedEventListener(listener: EventListener): void {
        this.removedListener = listener;
    }
}



export { CellEvents }