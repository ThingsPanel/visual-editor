import {Cell, Graph, Node, Color, Timing} from '@antv/x6';
import {Selection} from "@antv/x6-plugin-selection";
import {Clipboard} from "@antv/x6-plugin-clipboard";
import {History} from "@antv/x6-plugin-history";
import {Snapline} from "@antv/x6-plugin-snapline";
import {Transform} from "@antv/x6-plugin-transform";
import {Export} from "@antv/x6-plugin-export";
import extracted from "@/utils/makeedgevs"
import {register} from "@antv/x6-vue-shape";
import * as Common from "@/common";
import {CellEvents} from '../events/CellEvents';
import {message} from "@/utils";
import {PluginConfig} from '.';
import {Keyboard} from '@antv/x6-plugin-keyboard';
import {ICanvas} from '@antv/g2/lib/dependents';

import CellMove from '@/utils/CellMove';
import {useIs3DMode} from "@/store/modules/is3DStroe";

/**
 * @author cxs
 * @date 2023-04-19
 * @update 2023-05-19 新增了节点不可拖拽和调整大小的功能
 * @description 画布配置
 * @param graph 画布
 * @param containerId 画布容器id
 * @param autoResize 是否自动调整画布大小
 * @param gridSize 网格大小
 * @param selection 是否开启框选
 * @param history 是否开启撤销重做
 * @param enableMouseWheel 是否开启鼠标滚轮缩放
 * @param enableMousePan 是否开启鼠标平移画布
 * @param zoomFactor 缩放因子
 * @param rotatingGrid 节点每次旋转的角度
 * @class CanvasConfig
 * @implements {ICanvasConfig}
 */
class CanvasConfig implements ICanvasConfig {
    private static instance: CanvasConfig;
    private static displayInstance: CanvasConfig;
    graph: Graph | undefined = undefined;
    graphOptions: ICanvasConfig.GraphOptions;
    cellEvents: CellEvents | undefined = undefined;
    containerId: string;
    container: HTMLElement | SVGElement | undefined;
    autoResize: boolean = Common.DEFAULT_AUTO_RESIZE;
    gridSize: number = Common.DEFAULT_GRID_SIZE;
    history: boolean = Common.DEFAULT_HISTORY;
    selection: any;
    isDrawLine: boolean = false
    enableMouseWheel: boolean = Common.DEFAULT_ENABLE_MOUSE_WHEEL;
    enableMousePan: boolean = Common.DEFAULT_ENABLE_MOUSE_PAN;
    enableSelection: boolean = Common.DEFAULT_ENABLE_SELECTION;
    zoomFactor: number = Common.DEFAULT_ZOOM_FACTOR;
    enableRotating: boolean = Common.DEFAULT_ENABLE_ROTATING;
    rotatingGrid: number = Common.DEFAULT_RATATING_GRID;
    nodeMovable: boolean = Common.DEFAULT_NODE_MOVABLE;
    nodeResizable: boolean = Common.DEFAULT_NODE_RESIZABLE;
    screenRect: { width: number, height: number } = Common.DEFAULT_SCREEN_RECT;

    rulerCallbacks: ICanvasConfig.RulerCallback[] = [];
    callbackGraphOptions: any;

    private constructor(containerId: string, options?: ICanvasConfig.Options) {
        this.containerId = containerId;
        this.container = <HTMLDivElement>document.getElementById(this.containerId);
        if (options) {
            if (options.autoResize !== undefined) this.autoResize = options.autoResize;
            if (options.gridSize !== undefined) this.gridSize = options.gridSize;
            if (options.history !== undefined) this.history = options.history;
            if (options.enableMouseWheel !== undefined) this.enableMouseWheel = options.enableMouseWheel;
            if (options.enableMousePan !== undefined) this.enableMousePan = options.enableMousePan;
            if (options.enableSelection !== undefined) this.enableSelection = options.enableSelection;
            if (options.zoomFactor !== undefined) this.zoomFactor = options.zoomFactor;
            if (options.enableRotating !== undefined) this.enableRotating = options.enableRotating;
            if (options.rotatingGrid !== undefined) this.rotatingGrid = options.rotatingGrid;
            if (options.nodeMovable !== undefined) this.nodeMovable = options.nodeMovable;
            if (options.nodeResizable !== undefined) this.nodeResizable = options.nodeResizable;
            if (options.screenRect !== undefined) this.screenRect = options.screenRect;
        }
        this.graphOptions = {
            background: {},
            showGrid: Common.DEFAULT_SHOW_GRID,
            gridSize: this.gridSize,
            showRuler: Common.DEFAULT_SHOW_RULER
        }
        this.initGraph();
    }

    /**
     * 获取编辑器单例
     * @param containerId
     * @param options
     * @returns
     */
    public static getInstance(containerId: string = Common.DEFAULT_CONTAINER_ID, options?: ICanvasConfig.Options): CanvasConfig {
        if (!CanvasConfig.instance) {
            CanvasConfig.instance = new CanvasConfig(containerId, options);
        }
        return CanvasConfig.instance;
    }

    /**
     * 获取查看单例
     * @param containerId
     * @param options
     * @returns
     */
    public static getDisplayInstance(containerId: string = Common.DEFAULT_DISPLAY_CONTAINER_ID,
                                     options: ICanvasConfig.Options = {}): CanvasConfig {
        options.autoResize = true;
        options.nodeMovable = false;
        options.nodeResizable = false;
        options.enableRotating = false;
        options.enableSelection = false;
        if (!CanvasConfig.displayInstance) {
            CanvasConfig.displayInstance = new CanvasConfig(containerId, options);
        }
        return CanvasConfig.displayInstance;
    }


    initGraph(): void {
        Graph.registerNode(
            'rect_img',
            {
                inherit: 'image',
                width: 100,
                height: 100,
                markup: [
                    {
                        tagName: 'rect', // 标签名称
                        selector: 'body', // 选择器
                    },
                    {
                        tagName: 'image',
                        selector: 'image',
                    },
                ],
            }
            , true
        )

        // window.__x6_instances__ = [];
        this.graph = new Graph({
            container: <HTMLDivElement>document.getElementById(this.containerId),
            autoResize: this.autoResize,
            magnetThreshold: 5,
            mousewheel: {
                enabled: this.enableMouseWheel,
                modifiers: ['ctrl'],
            },
            panning: {
                enabled: this.enableMousePan,
                eventTypes: ["rightMouseDown"]
            },
            connecting: {
                snap: true,
                allowBlank: true,  //不允许指向空节点;  *@author 王炳宏  2023-05-23
                allowMulti: true,  //不允许重复连接;  *@author 王炳宏  2023-05-23
                allowLoop: false,   //不允许自连;   *@author; 王炳宏  2023-05-23
                allowNode: false,   //不允许非连接点连接,如需要改为true；  *@author; 王炳宏  2023-05-23
                allowEdge: false,   //不允许非连接点连接,如需要改为true； *@author; 王炳宏  2023-05-23
                allowPort: true,    //不允许指向空节点,*@author; 王炳宏  2023-05-23
                highlight: true,
                createEdge() {
                    return this.createEdge({
                        shape: "edge",
                        router: "normal",
                        attrs: {
                            line: {
                                stroke: '#343434',
                                strokeWidth: 2,
                                sourceMarker: null,
                                targetMarker: null,
                            },
                        },
                    });
                }
            },
            interacting: (cellView) => {
                return {
                    magnetConnectable: true,      // 增加可连接点的交互,magnetConnectable*@author; 王炳宏  2023-05-23
                    nodeMovable: this.nodeMovable,
                    edgeMovable: true      // 边是否可以被移动。
                }
            }
        });

        // window.__x6_instances__.push(this.graph);
        // 配置网格大小
        this.graph.setGridSize(this.gridSize);
        // 显示网格
        this.graph.showGrid();
        // 配置撤销重做
        if (this.history) {
            this.graph.use(
                new History({
                    enabled: true,
                    ignoreChange: true,
                })
            );
        }
        // 开启滚轮缩放画布
        if (this.enableMouseWheel) {
            this.graph.enableMouseWheel();
        }
        // 启用画布平移
        this.graph.enablePanning();

        // 启用对齐线
        this.graph.use(
            new Snapline({
                enabled: true,
            })
        );

        // 配置节点缩放
        const resizingOptions = {
            enabled: this.nodeResizable,
            minWidth: 80,
            maxWidth: 2000,
            minHeight: 40,
            maxHeight: 2000,
            orthogonal: false,
            restrict: true,
            preserveAspectRatio: false,
        }

        // 配置节点旋转
        const rotatingOptions = {
            enabled: this.enableRotating,
            grid: this.rotatingGrid,
        }
        // 启用缩放和旋转
        this.graph.use(
            new Transform({
                resizing: resizingOptions,
                rotating: rotatingOptions
            })
        );
        // 启用快捷键
        this.graph.use(
            new Keyboard({
                enabled: true,
            })
        );
        // 启用复制粘贴
        this.graph.use(
            new Clipboard({
                enabled: true,
            })
        );
        // 配置多节点框选
        if (this.enableSelection) {
            this.selection = new Selection({
                enabled: true,
                multiple: true,
                rubberband: true,
                rubberEdge: true,
                movable: true,
                showNodeSelectionBox: true
            })
            this.graph.use(this.selection);
        }
        // 启用导出
        this.graph.use(new Export());

        // 监听节点事件
        this.cellEvents = new CellEvents(this.graph, this.isDrawLine);

        this.setNodeMovable(this.nodeMovable);
        this.graph.centerContent();


        //键盘 绑定事件
        const that = this
        this.graph.bindKey('backspace', () => {
            // delete
            if (!this.enableSelection) return

            if (!that.graph)
                throw new Error('Graph is undefined.');
            that.graph.removeCells(this.selection.getSelectedCells())
        })
        this.graph.bindKey('ctrl+c', () => {
            if (!this.enableSelection) return
            if (!that.graph)
                throw new Error('Graph is undefined.');
            const cells = that.graph.getSelectedCells()
            if (cells.length) {
                that.graph.copy(cells)
            }
            return false
        })
        this.graph.bindKey('ctrl+v', () => {
            if (!this.enableSelection) return
            if (!that.graph)
                throw new Error('Graph is undefined.');
            if (!that.graph.isClipboardEmpty()) {
                const cells = that.graph.paste({offset: 32})
                that.graph.cleanSelection()
                that.graph.select(cells)
            }
            return false
        })
        this.graph.bindKey('up', () => {

            if (!this.enableSelection) return
            if (!that.graph)
                throw new Error('Graph is undefined.');
            const Cells = that.selection.getSelectedCells()
            CellMove(Cells, 'up', 1)
            return false
        })
        this.graph.bindKey('down', () => {
            if (!that.graph)
                throw new Error('Graph is undefined.');
            const Cells = that.selection.getSelectedCells()
            CellMove(Cells, 'down', 1)
            return false
        })
        this.graph.bindKey('right', () => {

            if (!this.enableSelection) return
            if (!that.graph)
                throw new Error('Graph is undefined.');
            const Cells = that.selection.getSelectedCells()
            CellMove(Cells, 'right', 1)

            return false
        })
        this.graph.bindKey('left', (e) => {
            if (!this.enableSelection) return
            if (!that.graph)
                throw new Error('Graph is undefined.');
            const Cells = that.selection.getSelectedCells()
            CellMove(Cells, 'left', 1)
            return false
        })
        this.graph.bindKey('shift+up', (e) => {
            if (!this.enableSelection) return
            if (!that.graph)
                throw new Error('Graph is undefined.');
            const Cells = that.selection.getSelectedCells()
            CellMove(Cells, 'up', 10)
            return false
        })
        this.graph.bindKey('shift+down', (e) => {
            if (!this.enableSelection) return
            if (!that.graph)
                throw new Error('Graph is undefined.');
            const Cells = that.selection.getSelectedCells()
            CellMove(Cells, 'down', 10)
            return false
        })
        this.graph.bindKey('shift+right', (e) => {
            if (!this.enableSelection) return
            if (!that.graph)
                throw new Error('Graph is undefined.');
            const Cells = that.selection.getSelectedCells()
            CellMove(Cells, 'right', 10)
            return false
        })
        const is3DMode = useIs3DMode()
        this.graph.bindKey('esc', (e) => {
            is3DMode.setFalse()
        })
        this.graph.bindKey('shift+left', (e) => {
            if (!this.enableSelection) return
            if (!that.graph)
                throw new Error('Graph is undefined.');
            const Cells = that.selection.getSelectedCells()
            CellMove(Cells, 'left', 10)
            return false
        })

        this.graph.bindKey('alt+1', () => {
            // delete
            if (!this.enableSelection) return

            if (!that.graph)
                throw new Error('Graph is undefined.');

            if (is3DMode.is3DMode) {
                is3DMode.setFalse()
            } else {
                is3DMode.setTrue()
            }


        })

    }


    public getGraph(): Graph | undefined {
        return this.graph;
    }

    public getEvents(): CellEvents | undefined {
        return this.cellEvents;
    }

    public setNodeMovable(nodeMovable: boolean): void {
        this.nodeMovable = nodeMovable;
        if (!this.nodeMovable) {
            this.graph?.disableSelectionMovable();
        }
    }

    //增加改变边样式的函数， ;  *@author; 王炳宏  2023-05-23

    public onChangeEdges(edgeId: any, nodeId: any, data: any): void {
        if (!this.graph)
            throw new Error('Graph is undefined.');
        const edge = this.graph.getCellById(edgeId)
        edge.attr('line/stroke', data.lineColor)
        let strokeD
        switch (data.lineStyle) {
            case 0:
                strokeD = '0'
                break
            case 1:
                strokeD = '5 5'
                break
            case 2:
                strokeD = '10 10'
                break
            case 3:
                strokeD = '10 10 2 10'
                break
        }
        edge.attr('line/strokeDasharray', strokeD)
        edge.attr('line/strokeWidth', data.lineWidth)
        let str1 = ''
        let strs1 = []
        let str2 = ''
        let strs2 = []
        if (data.starStyle === '0') {
            edge.attr('line/sourceMarker', null)
        } else {
            strs1 = data.starStyle.split('-')
            str1 = strs1[strs1.length - 1]
            edge.attr('line/sourceMarker', {size: 6 + data.lineWidth, name: str1, offset: -1})
        }
        if (data.endStyle === '0') {
            edge.attr('line/targetMarker', null)
        } else {
            strs2 = data.endStyle.split('-')
            str2 = strs2[strs2.length - 1]
            console.log(str2)
            edge.attr('line/targetMarker', {size: 6 + data.lineWidth, name: str2, offset: -1})
        }

        edge.removeMarkup()
        edge.getTransitions().forEach(
            (path) => edge.stopTransition(path),
        )
        this.edgeAnimation(edge, data)
        extracted(edge, data)
        edge.attr('targetData', data)
    }

    public edgeAnimation(edge: any, data: any): void {
        if (!this.graph)
            throw new Error('Graph is undefined.');
        let speed = 0
        let speed1 = 0
        if (data && data.flowSpeed) {
            switch (data.flowSpeed) {
                case 1:
                    speed = 4000
                    break
                case 2:
                    speed = 3000
                    break
                case 3:
                    speed = 2000
                    break
                case 4:
                    speed = 1000
                    break
            }
            switch (data.flowSpeed) {
                case 1:
                    speed1 = 210
                    break
                case 2:
                    speed1 = 180
                    break
                case 3:
                    speed1 = 160
                    break
                case 4:
                    speed1 = 130
                    break
            }
        }

        if (data && data.flowEffect !== '无效果') {
            let count = data.cycleTimes
            let count1 = -1
            if (data.cycleTimes != -1) {
                count1 = data.cycleTimes * 10
            } else {
                count1 = -1
            }
            if (data.flowEffect === '水流') {
                edge.setMarkup([
                    {
                        tagName: 'path',
                        selector: 'p2',
                        groupSelector: 'lines',
                    },
                    {
                        tagName: 'path',
                        selector: 'p1',
                    },

                ])
                edge.setAttrs({
                    ...edge.attr()
                })
                edge.attr('p2', {
                    ...edge.attr().line, connection: true,
                    fill: 'none', cursor: 'pointer',
                })

                edge.attr('p2/')
                edge.attr('p1', {
                    connection: true, stroke: data.flowColor,
                    fill: 'none', strokeDasharray: '10 5 10', strokeDashoffset: 10, strokeWidth: data.waters
                })
                const t1 = data.flowDirection === '正向' ? 10 : -10
                const options = {
                    delay: 10,
                    duration: speed1,
                    timing: Timing.linear,
                    complete: () => {
                        if (count1 == -1 || count1 > 1) {
                            const t = edge.attr('p1/strokeDashoffset') as number - (t1)
                            edge.transition('attrs/p1/strokeDashoffset', t, options)
                            if (count1 !== -1) {
                                count1 = count1 - 1
                            }
                        }
                    }
                }
                edge.transition('attrs/p1/strokeDashoffset', t1, options)
            } else {
                edge.setMarkup([

                    {
                        tagName: 'path',
                        selector: 'p1',
                    },
                    {
                        tagName: 'circle',
                        selector: 'c1',
                    },
                ])
                edge.attr('c1', {
                    r: data.droplet - 0,
                    stroke: data.flowColor,
                    fill: data.flowColor,
                    atConnectionRatio: data.flowDirection === '正向' ? 0.01 : 0.99,
                    strokeWidth: 1,
                    event: 'click:circle',
                })
                edge.attr('p1', {
                    ...edge.attr().line, connection: true,
                    fill: 'none', cursor: 'pointer',
                })
                const baseOption1 = {
                    delay: 1,
                    timing: Timing.linear,
                    duration: speed,
                }
                const baseOption2 = {
                    delay: 1,
                    timing: Timing.linear,
                    duration: 0,
                }
                const options4 = {
                    ...baseOption2,
                    complete: () => {
                        edge.transition('attrs/c1/atConnectionRatio', t, options1)
                    }
                }
                const options3 = {
                    ...baseOption2,
                    complete: () => {
                        edge.transition('attrs/c1/r', data.droplet - 0, options4)
                    }
                }
                const options2 = {
                    ...baseOption2,
                    complete: () => {
                        edge.transition('attrs/c1/atConnectionRatio', data.flowDirection === '正向' ? 0.01 : 0.99, options3)
                    }
                }
                const options1 = {
                    ...baseOption1,
                    complete: () => {
                        edge.transition('attrs/c1/r', 0, options2)
                    }
                }
                let t = edge.attr('c1/atConnectionRatio') > 0.01 ? 0.01 : 0.99
                edge.transition('attrs/c1/atConnectionRatio', t, options1)
            }
        }

    }

    public zoomToFit(): Number {
        if (!this.graph)
            throw new Error('Graph is undefined.');
        let result = this.graph.zoomToFit({});
        this.graph.centerContent();
        return Number((this.graph.zoom() * 100).toFixed(0));
    }

    public zoomIn(): Number {
        if (!this.graph)
            throw new Error('Graph is undefined.');
        this.graph.zoom(this.zoomFactor);
        return Number((this.graph.zoom() * 100).toFixed(0));
    }

    public getZoom(): number {
        if (!this.graph)
            throw new Error('Graph is undefined.');
        return this.graph.zoom();
    }

    public zoomOut(): Number {
        if (!this.graph)
            throw new Error('Graph is undefined.');
        this.graph.zoom(-this.zoomFactor);
        return Number((this.graph.zoom() * 100).toFixed(0));
    }

    public center(): void {
        if (!this.graph)
            throw new Error('Graph is undefined.');
        this.graph.centerContent();
    }

    public drawLine(): void {
        if (!this.graph)
            throw new Error('Graph is undefined.');
    }

    public enableSnapline(): void {
        if (!this.graph)
            throw new Error('Graph is undefined.');
        this.graph.enableSnapline()
    }

    public disableSnapline(): void {
        if (!this.graph)
            throw new Error('Graph is undefined.');
        this.graph.disableSnapline();
    }

    public showGrid(show: boolean): void {
        if (!this.graph)
            throw new Error('Graph is undefined.');
        if (show) {
            this.graph.showGrid();
        } else {
            this.graph.hideGrid();
        }
        this.graphOptions.showGrid = show;
    }

    public setRulerCallback(callback: ICanvasConfig.RulerCallback): void {
        // 去重
        if (this.rulerCallbacks.includes(callback)) return;
        this.rulerCallbacks.push(callback);
    }


    public showRuler(show: boolean): void {
        if (!this.graph)
            throw new Error('Graph is undefined.');
        this.rulerCallbacks.forEach(callback => callback({show}));
    }

    public setBackground(options: ICanvasConfig.BackgroundOptions): void {
        if (!this.graph)
            throw new Error('Graph is undefined.');
        this.graphOptions.background = options;
        this.callbackGraphOptions && this.callbackGraphOptions(this.graphOptions);
        this.graph.drawBackground(options);
    }

    public getGraphOptions(_cb: any) {
        this.callbackGraphOptions = _cb;
        return this.graphOptions;
    }

    public getGridSize(): number {
        return this.gridSize;
    }

    public setGridSize(gridSize: number): void {
        if (!this.graph)
            throw new Error('Graph is undefined.');
        this.gridSize = gridSize;
        this.graph.setGridSize(gridSize);
        this.graphOptions.gridSize = gridSize;
    }

    public undo(): void {
        if (!this.graph)
            throw new Error('Graph is undefined.');
        this.graph.undo();
    }

    public redo(): void {
        if (!this.graph)
            throw new Error('Graph is undefined.');
        this.graph.redo();
    }

    public renderJSON(json: any): void {
        if (!this.graph)
            throw new Error('Graph is undefined.');
        const pluginConfig: IPluginConfig = PluginConfig.getInstance(null);
        console.log('renderJSON.pluginConfig', pluginConfig)
        // 配置画布背景
        if (json.graph && json.graph.background) {
            this.setBackground(json.graph.background);
        }
        // 注册插件
        if (CanvasConfig.instance) {
            pluginConfig.registerComponents("editor", json.cells);
        } else if (CanvasConfig.displayInstance) {
            pluginConfig.registerComponents("display", json.cells);
        }
        console.log('renderJson', json)
        this.graph.fromJSON(json);
    }

    public toJSON(): { cells: Cell.Properties[] } | { graph: any } {

        console.log( this.graph?.getCells(),"this.graph?.getCells()")


        if (!this.graph)
            throw new Error('Graph is undefined.');
        const json = {
            ...this.graph.toJSON(),
            graph: this.graphOptions
        };
        return json;
    }

    public exportSVG(fileName?: string, options?: Export.ToImageOptions): void {
        if (!this.graph)
            throw new Error('Graph is undefined.');
        this.graph.exportSVG(fileName, options);
    }

    public exportPNG(fileName?: string, options?: Export.ToImageOptions): void {
        if (!this.graph)
            throw new Error('Graph is undefined.');
        this.graph.exportPNG(fileName, options);
    }

    public exportJPEG(fileName?: string, options?: Export.ToImageOptions): void {
        if (!this.graph)
            throw new Error('Graph is undefined.');
        this.graph.exportJPEG(fileName, options);
    }

    public addComponent(
        component: any,
        name: string,
        pos?: { x: number, y: number },
        size?: { w: number, h: number },
        data?: Object): Node<Node.Properties> {
        if (!this.graph)
            throw new Error('Graph is undefined.');
        register({
            shape: name,
            width: size?.w || 100,
            height: size?.h || 100,
            component
        })
        let _data: { width: number, height: number } = {width: size?.w || 100, height: size?.h || 100};

        return this.graph.addNode({
            shape: name,
            x: pos?.x || 0,
            y: pos?.y || 0,
            data: _data
        });
    }

}


export {CanvasConfig};





