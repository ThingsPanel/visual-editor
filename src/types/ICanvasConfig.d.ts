/**
 * @author cxs
 * @date 2023-04-19
 * @update 2023-05-19 增加了ICanvasConfig.Options接口
 * @description 画布配置接口
 * @interface ICanvasConfig
 */
declare interface ICanvasConfig {

    /**
     * 画布
     */
    graph: Graph | undefined;

    /**
     * 节点事件处理
     */
    cellEvents: CellEvents | undefined;

    /**
     * 画布容器ID
     */
    containerId: string;

    /**
     * 是否自动调整画布大小
     */
    autoResize: boolean;

    /**
     * 网格大小
     */
    gridSize: number;

    /**
     * 网格大小
     */
    history: boolean;

    /**
     * 是否开启鼠标滚轮缩放
     */
    enableMouseWheel: boolean;

    /**
     * 是否开启鼠标平移画布
     */
    enableMousePan: boolean;

    /**
     * 是否开启多节点框选
     */
    enableSelection: boolean;

    /**
     * 缩放因子
     */
    zoomFactor: number;

    /**
     * 节点是否可旋转
     */
    enableRotating: boolean;

    /**
     * 节点每次旋转的角度
     */
    rotatingGrid: number;

    /**
     * 节点是否可移动
     */
    nodeMovable: boolean;

    /**
     * 节点是否可缩放
     */
    nodeResizable: boolean;

    /**
     * 标尺回调
     */
    rulerCallbacks: ICanvasConfig.RulerCallback[];

    /**
     * 初始化画布
     */
    initGraph(): void;

    /**
     * 获取画布
     * @returns Graph | undefined
     */
    getGraph(): Graph | undefined;

    getEvents(): CellEvents | undefined;

    /**
     * 配置节点是否可移动
     * @param nodeMovable 
     */
    setNodeMovable(nodeMovable: boolean): void;

    

    /**
     * 测试线条的颜色修改工具
     * @param command 
     */
    onChangeEdges(edgeId: any,nodeId: any,data:any): void;


    edgeAnimation(edge:any,data:any): void;
    /**
     * 渲染节点数据
     * @param json 节点数据
     */
    renderJSON(json: any): void;

    /**
     * 画布自适应
     */
    zoomToFit(): Number;

    /**
     * 放大
     */
    zoomIn(): Number;

    /**
     * 缩小
     * @param factor 
     */
    zoomOut(): Number;

    /**
     * 获取当前缩放比例
     */
    getZoom(): Number;

    /**
     * 画布内容居中
     */
    center(): void;

    /**
     * 开启对齐线
     */
    enableSnapline(): void;

    /**
     * 关闭对齐线
     */
    disableSnapline(): void;

    /**
     * 是否显示网格
     * @param show 
     */
    showGrid(show: boolean): void;

    /**
     * 设置标尺回调
     * @param callback 
     */
    setRulerCallback(callback: ICanvasConfig.RulerCallback): void;

    /**
     * 是否显示标尺
     * @param show 
     */
    showRuler(show: boolean): void;

    /**
     * 配置画布背景
     * @param options 
     */
    setBackground(options: ICanvasConfig.BackgroundOptions): void;

    /**
     * 获取画布背景
     */
    getGraphOptions(_cb: any): ICanvasConfig.GraphOptions;
    
    /**
     * 获取网格大小
     */
    getGridSize(): number;

    /**
     * 设置网格大小
     * @param gridSize 
     */
    setGridSize(gridSize: number): void;

    /**
     * 撤销
     */
    undo(): void;

    /**
     * 重做
     */
    redo(): void;

    /**
     * 导出JSON
     * @returns { cells: Cell.Properties[] }
     */
    toJSON(): { cells: Cell.Properties[] } | { graph: any };

    /**
     * 导出SVG
     * @param fileName  文件名,缺省为 chart
     * @param options   导出配置
     */
    exportSVG(fileName?: string, options?: Export.ToImageOptions): void;

    /**
     * 导出PNG
     * @param fileName  文件名,缺省为 chart
     * @param options   导出配置
     */
    exportPNG(fileName?: string, options?: Export.ToImageOptions): void;

    /**
     * 导出JPEG
     * @param fileName  文件名,缺省为 chart
     * @param options   导出配置
     */
    exportJPEG(fileName?: string, options?: Export.ToImageOptions): void;

    /**
     * 添加自定义组件
     * @param component 
     * @param name 名称
     * @returns Node<Node.Properties>
     */
    addComponent(component: any, name: string): Node<Node.Properties>;

    /**
     * 添加自定义组件
     * @param component 
     * @param name 名称
     * @param pos 坐标
     * @returns Node<Node.Properties>
     */
    addComponent(component: any, name: string, pos: { x: number, y: number }): Node<Node.Properties>;

    /**
     * 添加自定义组件
     * @param component 
     * @param name 名称
     * @param pos 坐标
     * @param size 大小
     * @returns Node<Node.Properties>
     */
    addComponent(component: any, name: string, pos: { x: number, y: number }, size: {w: number, h: number}): Node<Node.Properties>;

    /**
     * 添加自定义组件
     * @param component 
     * @param name 名称
     * @param pos   坐标
     * @param size  大小
     * @param data  数据
     * @returns Node<Node.Properties>
     */
    addComponent(component: any, name: string, pos: { x: number, y: number }, size: {w: number, h: number}, data: Object): Node<Node.Properties>;

}


declare namespace ICanvasConfig {
    /**
     * @author cxs
     * @date 2023-05-23
     * @update 2023-05-23
     * @description 画布配置
     * @param autoResize        是否自动调整画布大小
     * @param gridSize          网格大小
     * @param selection         是否开启多节点框选
     * @param history           是否开启历史记录
     * @param enableMouseWheel  是否开启鼠标滚轮缩放
     * @param enableMousePan    是否开启鼠标平移画布
     * @param enableSelection   是否开启多节点框选
     * @param zoomFactor        缩放因子
     * @param enableRotating    节点是否可旋转
     * @param rotatingGrid      节点每次旋转的角度
     * @param nodeMovable       节点是否可移动
     * @param nodeResizable     节点是否可缩放
     * @param screenRect        显示器大小
     */
    export interface Options {
        autoResize?: boolean;
        gridSize?: number;
        selection?: boolean;
        history?: boolean;
        enableMouseWheel?: boolean;
        enableMousePan?: boolean;
        enableSelection?: boolean;
        zoomFactor?: number;
        enableRotating?: boolean;
        rotatingGrid?: number;
        nodeMovable?: boolean;
        nodeResizable?: boolean;
        screenRect?: {
            width: number;
            height: number;
        }
    }

    /**
     * @author cxs
     * @date 2023-05-25
     * @update 2023-05-25
     * @description 背景配置
     * @param color         背景颜色
     * @param showImage     是否显示背景图片
     * @param repeat        背景图片重复方式
     * @param position      背景图片位置
     * @param size          背景图片大小
     * @param opacity       背景图片透明度
     * @param angle         背景图片角度
     */
    export interface BackgroundOptions {
        color?: string
        showImage?: boolean
        repeat?: string
        position?: string
        size?: string
        opacity?: number
        angle?: number
      }

    /**
     * @author cxs
     * @date 2023-05-25
     * @update 2023-05-25
     * @description 画布背景、网格和标尺配置
     * @param background   背景配置
     * @param grid         网格
     * @param gridSize     网格大小
     * @param ruler        标尺
     */
    export interface GraphOptions {
        background: BackgroundOptions,
        showGrid: boolean,
        gridSize: number,
        showRuler: boolean
    }

    /**
     * 标尺回调
     */
    export interface RulerCallback {
        (options: any): void;
    }
}
