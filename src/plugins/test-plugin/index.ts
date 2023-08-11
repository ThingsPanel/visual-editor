import { Text_Attribute, Text_Data, Text_Icon, Text_Main } from "./text";
import { Switch_Attribute, Switch_Data, Switch_Main, Switch_Icon } from "./electricSwitch";
import { Light_Attribute, Light_Data, Light_Main, Light_Icon } from "./electricLight";
import { Grounding_Attribute, Grounding_Data, Grounding_Main, Grounding_Icon } from "./electricGrounding";
import { Resistor_Attribute, Resistor_Data, Resistor_Main, Resistor_Icon } from "./electricResistor";
import { Diode_Attribute, Diode_Data, Diode_Main, Diode_Icon } from "./electricDiode";
import { Capacitor_Attribute, Capacitor_Data, Capacitor_Main, Capacitor_Icon } from "./electricCapacitor";
import { Fuse_Attribute, Fuse_Data, Fuse_Main, Fuse_Icon } from "./electricFuse";
import { Motor_Attribute, Motor_Data, Motor_Main, Motor_Icon } from "./electricMotor";
import { Power_Attribute, Power_Data, Power_Main, Power_Icon } from "./electricPower";
import { Voltmeter_Attribute, Voltmeter_Data, Voltmeter_Main, Voltmeter_Icon } from "./electricVoltmeter";
import { Battery_Attribute, Battery_Data, Battery_Main, Battery_Icon } from "./electricBattery";
import {
    Object_Attribute as Object1_Attribute, Object_Data as Object1_Data,
    Object_Main as Object1_Main, Object_Icon as Object1_Icon
} from "./electricObject1";
import {
    Object_Attribute as Object2_Attribute, Object_Data as Object2_Data,
    Object_Main as Object2_Main, Object_Icon as Object2_Icon
} from "./electricObject2";
import {
    Object_Attribute as Object3_Attribute, Object_Data as Object3_Data,
    Object_Main as Object3_Main, Object_Icon as Object3_Icon
} from "./electricObject3";
import {
    Object_Attribute as Object4_Attribute, Object_Data as Object4_Data,
    Object_Main as Object4_Main, Object_Icon as Object4_Icon
} from "./electricObject4";
import {
    Object_Attribute as Object5_Attribute, Object_Data as Object5_Data,
    Object_Main as Object5_Main, Object_Icon as Object5_Icon
} from "./electricObject5";
import {
    Switch_Attribute as Switch1_Attribute, Switch_Data as Switch1_Data,
    Switch_Main as Switch1_Main, Switch_Icon as Switch1_Icon
} from "./electricSwitch1";

export default {
    views: [
        {
            name: "文本",
            description: "",
            group: "自定义组件",
            type: "text",
            icon: Text_Icon,
            size: { width: 100, height: 40 },
            Main: Text_Main,
            Attribute: Text_Attribute,
            Data: Text_Data,
        },
        {
            name: "电力开关1",
            description: "",
            group: "自定义组件",
            type: "switch",
            icon: Switch_Icon,
            size: { width: 170, height: 200 },
            Main: Switch_Main,
            Attribute: Switch_Attribute,
            Data: Switch_Data,
        },
        {
            name: "电力开关2",
            description: "",
            group: "自定义组件",
            type: "switch",
            icon: Switch1_Icon,
            size: { width: 80, height: 80 },
            Main: Switch1_Main,
            Attribute: Switch1_Attribute,
            Data: Switch1_Data,
        },
        {
            name: "灯",
            description: "object",
            group: "自定义组件",
            type: "",
            icon: Light_Icon,
            size: { width: 100, height: 100 },
            Main: Light_Main,
            Attribute: Light_Attribute,
            Data: Light_Data,
        },
        {
            name: "接地",
            description: "object",
            group: "自定义组件",
            type: "",
            icon: Grounding_Icon,
            size: { width: 100, height: 100 },
            Main: Grounding_Main,
            Attribute: Grounding_Attribute,
            Data: Grounding_Data,
        },
        {
            name: "电力组件1",
            description: "object",
            group: "自定义组件",
            type: "",
            icon: Object1_Icon,
            size: { width: 100, height: 100 },
            Main: Object1_Main,
            Attribute: Object1_Attribute,
            Data: Object1_Data,
        },
        {
            name: "电力组件2",
            description: "object",
            group: "自定义组件",
            type: "",
            icon: Object2_Icon,
            size: { width: 100, height: 82 },
            Main: Object2_Main,
            Attribute: Object2_Attribute,
            Data: Object2_Data,
        },
        {
            name: "电容1",
            description: "object",
            group: "自定义组件",
            type: "",
            icon: Capacitor_Icon,
            size: { width: 95, height: 70 },
            Main: Capacitor_Main,
            Attribute: Capacitor_Attribute,
            Data: Capacitor_Data,
        },
        {
            name: "电阻1",
            description: "object",
            group: "自定义组件",
            type: "",
            icon: Resistor_Icon,
            size: { width: 100, height: 27 },
            Main: Resistor_Main,
            Attribute: Resistor_Attribute,
            Data: Resistor_Data,
        },
        {
            name: "二极管1",
            description: "object",
            group: "自定义组件",
            type: "",
            icon: Diode_Icon,
            size: { width: 100, height: 44 },
            Main: Diode_Main,
            Attribute: Diode_Attribute,
            Data: Diode_Data,
        },
        {
            name: "熔断管",
            description: "object",
            group: "自定义组件",
            type: "",
            icon: Fuse_Icon,
            size: { width: 100, height: 70 },
            Main: Fuse_Main,
            Attribute: Fuse_Attribute,
            Data: Fuse_Data,
        },
        {
            name: "三相电机",
            description: "object",
            group: "自定义组件",
            type: "",
            icon: Motor_Icon,
            size: { width: 140, height: 140 },
            Main: Motor_Main,
            Attribute: Motor_Attribute,
            Data: Motor_Data,
        },
        {
            name: "电源",
            description: "object",
            group: "自定义组件",
            type: "",
            icon: Power_Icon,
            size: { width: 140, height: 91 },
            Main: Power_Main,
            Attribute: Power_Attribute,
            Data: Power_Data,
        },
        {
            name: "电压表",
            description: "object",
            group: "自定义组件",
            type: "",
            icon: Voltmeter_Icon,
            size: { width: 42, height: 42 },
            Main: Voltmeter_Main,
            Attribute: Voltmeter_Attribute,
            Data: Voltmeter_Data,
        },
        {
            name: "电力组件3",
            description: "object",
            group: "自定义组件",
            type: "",
            icon: Object3_Icon,
            size: { width: 80, height: 161 },
            Main: Object3_Main,
            Attribute: Object3_Attribute,
            Data: Object3_Data,
        }, ,
        {
            name: "电力组件4",
            description: "object",
            group: "自定义组件",
            type: "",
            icon: Object4_Icon,
            size: { width: 100, height: 124 },
            Main: Object4_Main,
            Attribute: Object4_Attribute,
            Data: Object4_Data,
        }, ,
        {
            name: "电力组件5",
            description: "object",
            group: "自定义组件",
            type: "",
            icon: Object5_Icon,
            size: { width: 80, height: 202 },
            Main: Object5_Main,
            Attribute: Object5_Attribute,
            Data: Object5_Data,
        },
        {
            name: "电源2",
            description: "object",
            group: "自定义组件",
            type: "",
            icon: Battery_Icon,
            size: { width: 63, height: 63 },
            Main: Battery_Main,
            Attribute: Battery_Attribute,
            Data: Battery_Data,
        },
    ],
};