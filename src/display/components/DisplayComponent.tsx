import { parseJSONData } from "@/utils";
import { Component, defineComponent } from "vue";
import { DataConfig } from "../config/DataConfig";

export const getDisplayComponent = (cpt: Component, nodeData: any): Component => {
    const dataConfig: DataConfig = new DataConfig(nodeData);

    return defineComponent({
        data() {
            return {
                value: undefined,
                style: undefined,
                option: undefined,
                data: undefined
            }
        },
        mounted() {
            
            // 从节点的附加数据中获取样式和绑定数据
            const jsonData = parseJSONData(nodeData.jsonData);
            if (!jsonData) return;
            if (jsonData.style) {
                this.style = { ...jsonData.style }
            }
            if (jsonData.data) {
                this.data = { ...jsonData.data } ;
                if (jsonData.data.bindType === "static") {
                    // 静态数据
                    this.value = jsonData.data.static;
                } else if (jsonData.data.bindType === "dynamic") {
                    // 动态数据
                    // this.value = jsonData.data.dynamic;
                } else if (jsonData.data.bindType === "device") {
                    // 设备数据
                    const cb = (value: any) => {
                        console.log('callback', value)
                        this.value = value;
                    }
                    // 设置回调
                    dataConfig.setCallback(cb);
                    // 启动定时器开始刷新数据
                    dataConfig.start();
                }
            }
            if (jsonData.option) {
                this.option = { ...jsonData.option }
            }
        },
        methods: {
            onChange(value: any) {
                const { device } = value; 
                console.log('display.change', device.deviceId)
                dataConfig.stop();
                // 改变了数据入口
                dataConfig.setDeviceId(device.deviceId);
                // 重启定时器
                dataConfig.start();
            }
        },
        render() {
            return (
                <cpt value={this.value} style={this.style} data={this.data} option={this.option} onChange={this.onChange}/>
            )
        }
    })
}