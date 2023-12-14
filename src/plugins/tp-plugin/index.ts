//官方默认插件，请勿修改
import { Curve_Attribute, Curve_Init, Curve_Icon, Curve_Main } from "./curve";
import { Text_Attribute, Text_Main, Text_Icon, Text_Init } from "./text";
import { Yibiaopan_Attribute, Yibiaopan_Data, Yibiaopan_Icon, Yibiaopan_Main } from "./yibiaopan";
import { Amap_Attribute, Amap_Data, Amap_Icon, Amap_Main } from "./map";
import { picechart_Attribute, picechart_Data, picechart_Icon, picechart_Main } from "./pie";
import { TB_Attribute, TB_Data, TB_Icon, TB_Main } from "./table";
import { histogram_Attribute, histogram_Data, histogram_Icon, histogram_Main } from "./histogram";
import { Timer_Attribute, Timer_Data, Timer_Icon, Timer_Main } from "./timer";
import { Liquid_Icon, Liquid_Main, Liquid_Attribute, Liquid_Data} from "./liquid";
import {Switch_Attribute, Switch_Data, Switch_Icon, Switch_Main,} from "./switch";
import { Video_Icon, Video_Main, Video_Attribute, Video_Data } from "./video";
//引入你准备好的插件配置
import {Three2_Attribute, Three2_Data, Three2_Icon, Three2_Main } from "./threejs-demo2";
//官方默认配置，请勿修改


let defaultViews = [
  {
    name: "文本",
    description: "",
    group: "常用组件",
    type: "text",
    icon: Text_Icon,
    size: { width: 100, height: 40 },
    Main: Text_Main,
    Attribute: null,
    Data: null,
    config: Text_Init
  },
  {
    name: "时间",
    description: "",
    group: "常用组件",
    icon: Timer_Icon,
    size: { width: 200, height: 40 },
    Main: Timer_Main,
    Attribute: Timer_Attribute,
    Data: Timer_Data,
  },
  {
    name: "开关",
    description: "",
    group: "常用组件",
    type: "switch",
    icon: Switch_Icon,
    size: { width: 100, height: 40 },
    Main: Switch_Main,
    Attribute: Switch_Attribute,
    Data: Switch_Data,
  },
  {
    name: "仪表盘",
    description: "",
    group: "常用组件",
    type: "dashboard",
    icon: Yibiaopan_Icon,
    size: { width: 200, height: 200 },
    Main: Yibiaopan_Main,
    Attribute: Yibiaopan_Attribute,
    Data: Yibiaopan_Data,
  },
  {
    name: "水波图",
    description: "",
    group: "常用组件",
    icon: Liquid_Icon,
    size: { width: 200, height: 200 },
    Main: Liquid_Main,
    Attribute: Liquid_Attribute,
    Data: Liquid_Data,
  },
  {
    name: "饼状图",
    description: "",
    group: "常用组件",
    type: "pie",
    icon: picechart_Icon,
    size: { width: 200, height: 200 },
    Main: picechart_Main,
    Attribute: picechart_Attribute,
    Data: picechart_Data,
  },
  {
    name: "柱状图",
    description: "",
    group: "常用组件",
    type: "histogram",
    icon: histogram_Icon,
    size: { width: 200, height: 200 },
    Main: histogram_Main,
    Attribute: histogram_Attribute,
    Data: histogram_Data,
  },
  {
    name: "曲线图",
    description: "",
    group: "常用组件",
    type: "curve",
    icon: Curve_Icon,
    size: { width: 200, height: 200 },
    Main: Curve_Main,
    Attribute: Curve_Attribute,
    Data: null,
    config: Curve_Init
  },
  {
    name: "滚动列表",
    description: "",
    group: "常用组件",
    type: "table",
    icon: TB_Icon,
    size: { width: 500, height: 300 },
    Main: TB_Main,
    Attribute: TB_Attribute,
    Data: TB_Data,
  },
  {
    name: "地图",
    description: "",
    group: "常用组件",
    type: "map",
    icon: Amap_Icon,
    size: { width: 200, height: 200 },
    Main: Amap_Main,
    Attribute: Amap_Attribute,
    Data: Amap_Data,
  },
  {
    name: "视频",
    description: "",
    type: "video",
    group: "常用组件",
    icon: Video_Icon,
    size: { width: 200, height: 200 },
    Main: Video_Main,
    Attribute: Video_Attribute,
    Data: Video_Data,
  },
];
// 你自己的配置数据
const Three2Obj = {
  name: "ThreeJsDemo", //插件节点名称，也就是x6的shape属性，开头必须是ThreeJs，以用来区分其他节点
  description: "", //插件描述，自定义
  type: "3d", //类型，固定，否则可能报错
  group: "3D", //分组，固定，否则可能报错
  icon: Three2_Icon, //左侧列表显示图标，必须
  size: { width: 800, height: 600 }, //初始大小
  Main: Three2_Main, //插件入口文件
  Attribute: Three2_Attribute, //插件样式设置面版组件
  Data: Three2_Data, //插件数据绑定面包组件
};

export default {
  views: [
    ...defaultViews,
    Three2Obj //加入你的组件配置
  ],
};
// {
//     name: "ThreejsDemo",
//         description: "",
//     type: "3d",
//     group: "3D",
//     icon: Three_Icon,
//     size: { width: 800, height: 600 },
//     Main: Three_Main,
//         Attribute: Three_Attribute,
//     Data: Three_Data
// },
