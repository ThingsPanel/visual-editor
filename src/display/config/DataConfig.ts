import DataAPI from '@/api/data';
import { isArray, isJSON } from '@/utils';

class DataConfig {

    /**
     * 5秒刷新一次
     */
    private refreshInterval: number = 5;

    private callback: Function = () => {};

    private deviceId: string = "";

    private property: any = {};

    private properties: any[] = [];

    private devicesData: any[] = [];

    private value: any = undefined;

    private refType: string = "";

    /**
     * 节点数据
     */
    private nodeData: any;


    /**
     * 定时器
     */
    private timer: any = null;

    constructor(nodeData: any, refType: any) {
        this.nodeData = nodeData;
        this.refType = refType;
    }

    public setRefreshInterval(refreshInterval: number) {
        this.refreshInterval = refreshInterval;
    }

    public setDevicesData(devicesData: any[]) {
        this.devicesData = devicesData;
    }

    public setDeviceId(deviceId: string) {
        this.deviceId = deviceId;
    }

    public setProperty(property: any) {
        this.property = property;
    }

    public setProperties(properties: any[]) {
        this.properties = properties;
    }

    public setCallback(callback: Function) {
        this.callback = callback;
    }

    public setValue(value: any) {
        this.value = value;
    }

    public start() {
        console.log('DataConfig.start', this.refType, this.devicesData, this.value)
        if (this.refType.trim() === 'switch') {
            // 开关不需要定时器
            if (this.value === undefined) return;
            const values: any = {};
            const { name: property, dataRange, dataType } = this.devicesData[0].propertyList[0];
            try {
                let off = dataRange.split('-')[0]
                let on = dataRange.split('-')[1]
                if (off === 'true' || off === true) off = 'false';
                if (on === 'false' || on === false) on = 'true';
                if (off === '1' || off === 1) off = '0';
                if (on === '0' || on === 0) on = '1';
                off = this.typeConvert(off, dataType);
                on = this.typeConvert(on, dataType);
                values[property] = this.value ? on : off;
            } catch(err) {
                values[property] = this.value
            }
            DataAPI.setDeviceValue({ device_id: this.deviceId, values })
                .then(({ data: result}) => {
                    if (result.code !== 200) return;
                    console.log('DataConfig.start.switch.result', result)
                    this.callback && this.callback(true);
                })
            return;
        }
        let isRunning: boolean = false;
        const intervalFunc: Function = () => {
            if (isRunning) return;
            isRunning = true;
            console.log('DataConfig.start', this.devicesData);
            this.parseData()
                .then((result) => {
                    if (result) {
                        isRunning = false;
                    }
                })
        }
        // 启动定时器后先执行一次获取数据
        intervalFunc();
        this.timer = setInterval(intervalFunc, this.refreshInterval * 1000);
    }

    private parseData() {
        console.log('DataConfig.parseData.devicesData', this.devicesData)
        return new Promise(async (resolve, reject) => {
            let deviceList: any[] = [];
            this.devicesData.forEach((device: any) => {
                deviceList.push({
                    deviceId: device.deviceId,
                    property: device.property,
                    propertyTitle: device.propertyTitle,
                    propertyList: device.propertyList,
                    properties: device.properties
                })
            });
                        console.log('DataConfig.parseData.deviceList', deviceList)
            if (!this.refType || this.refType === 'text' || this.refType === 'dashboard') {
                // ===================================文本=========================================
                let { data: result } = await DataAPI.getCurrentValue({ entity_id: deviceList[0].deviceId });
                if (result.code === 200) {
                    const { data } = result;
                    console.log('start', data)
                    let value = "无数据";
                    if (data && data.length !== 0) {
                        const property = deviceList[0].propertyList[0]?.name || deviceList[0].properties[0];
                        // value = data[0][property];
                        value = data[property];
                    }
                    this.callback(value);
                }
                resolve(true);
            } else if (this.refType === 'pie') {
                // ===================================饼图=========================================
                let values: any[] = [];
                for(let i = 0; i < deviceList.length; i++) {
                    const device = deviceList[i];
                    let { data: result } = await DataAPI.getCurrentValue({ entity_id: device.deviceId });
                    if (result.code === 200) {
                        const { data } = result;
                        device.propertyList.forEach((property: any) => {
                            if (data && data.length !== 0) {
                                let value = data[property.name] || 0;
                                values.push({ type: property.title, value: Number(value)})
                            } else {
                                values.push({ type: property.title, value: 0})
                            }
                        })
                    }
                }
                this.callback(JSON.stringify(values));
                resolve(true);
            } else if (this.refType === 'histogram') {
                // ===================================柱状图=========================================
                let values: any[] = [];
                for(let i = 0; i < deviceList.length; i++) {
                    const device = deviceList[i];
                    let { data: result } = await DataAPI.getCurrentValue({ entity_id: device.deviceId });
                    console.log('parseData.result', result)
                    if (result.code === 200) {
                        const { data } = result;
                        device.propertyList.forEach((property: any) => {
                            if (data && data.length !== 0) {
                                let value = data[property.name] || 0;
                                values.push({ type: property.title, sales: Number(value)})
                            } else {
                                values.push({ type: property.title, sales: 0})
                            }
                        })
                    }
                }
                this.callback(JSON.stringify(values));
                resolve(true);
            } else if (this.refType === 'curve') {
                // ===================================曲线图=========================================
                let endTime = (new Date()).getTime();
                let startTime = endTime - (Number(24*60*60*10) * 1000);
                let rate = 5 * 60 * 1000 * 1000;
                let systime: any[] = [];
                let datas: any[] = [];
                for (let i = 0; i < deviceList.length; i++) {
                    const device = deviceList[i];
                    const properties = device.propertyList.map((property: any) => property.name);
                    console.log('DataConfig.parseData.curve', device.propertyList, properties)
                    const params = {
                        device_id: device.deviceId,
                        attribute: ["systime", ...properties],
                        start_ts: startTime,
                        end_ts: endTime,
                        rate: rate + ""
                    }
                    let { data: result } = await DataAPI.getHistory(params);
                    if (result.code === 200) {
                        const { data } = result;
                        systime = data.systime;
                        device.propertyList.forEach((property: any) => {
                            let obj = {
                                name: property.name,
                                title: property.title,
                                value: data[property.name]
                            }
                            datas.push(obj);
                        })
                    }
                }
                let values = this.getCurveData(systime, datas);
                this.callback(JSON.stringify(values));
                resolve(true);
            } else if (this.refType === 'xzy') {
                // ===================================xzy=========================================
                const deviceId = this.deviceId;
                console.log('DataConfig.parseData.xzy', deviceId);

                if (!deviceId) {
                    resolve(true);
                    return;
                }
                let { data: result } = await DataAPI.getCurrentValue({ entity_id: deviceId });
                if (result.code === 200) {
                    const { data } = result;
                    console.log('start', data)
                    let value = {};
                    if (data && data.length !== 0) {
                        value = data;
                        this.callback({ current: value});
                    }
                }
                let endTime = (new Date()).getTime();
                let startTime = endTime - (Number(24*60*60*10) * 1000);
                let rate = 5 * 1000 * 1000;
                const params = {
                    device_id: this.deviceId,
                    attribute: ["systime", this.property.field, this.property.outField],
                    start_ts: startTime,
                    end_ts: endTime,
                    rate: rate + ""
                }
                let { data: historyResult } = await DataAPI.getHistory(params);
                if (historyResult.code === 200) {
                    console.log('DataConfig.parseData.xzy.historyResult', historyResult)
                    const history = historyResult.data || {};
                    this.callback({ history })
                }
                resolve(true);
            } else if (this.refType === 'table') {
                // ===================================表格=========================================
                
                let values = [];
                for(let i = 0; i < deviceList.length; i++) {
                    const device = deviceList[i];                    
                    const propertys = device.propertyList.map((x:any) => x.name)
                    let { data: result } = await DataAPI.getCurrentValue({ entity_id: device.deviceId, attribute: ["systime", ...propertys] });
                    console.log('parseData.result', result)
                    if (result.code === 200) {
                        const { data } = result;
                        if (data && data.length !== 0) {
                            const propCurrentValue = data;
                            const valueItem:any = {deviceId:device.deviceId}
                            for (const [key, value] of Object.entries(propCurrentValue)) {                                                                                            
                                valueItem[`device_property_${device.deviceId}_${key}`] = value
                                if(key === 'systime'){
                                    valueItem.systime = value
                                }                                
                            }                                                                                   
                            values.push(valueItem)                             
                        }
                    }
                }
                console.log('DataConfig.table', values)
                this.callback(JSON.stringify(values));
                resolve(true);
            } else if (this.refType === 'switch') {
                // ===================================开关=========================================
                console.log('DataConfig.parseData.switch', this.deviceId, this.property)
                this.stop();
            } else if (this.refType === 'weather') {
                // ===================================气象站=========================================
                let { data: result } = await DataAPI.getCurrentValue({ entity_id: deviceList[0].deviceId });
                if (result.code === 200) {
                    const { data } = result;
                    console.log('start', data)
                    let value = "无数据";
                    if (data && data.length !== 0) {
                        // const property = deviceList[0].propertyList[0]?.name || deviceList[0].properties[0];
                        // console.error(property, data)
                        value = data;
                    }
                    this.callback(value);
                }
                resolve(true);
            }
        })

    }

    public restart() {
        this.stop();
        this.start();
    }

    public stop() {
        if (!this.timer) return;
        clearInterval(this.timer);
    }

    private getCurveData(systime: any, datas: any) {
        const length = systime.length;
        console.log('DataConfig.getCurveData', systime, length, datas)
        let series: any[] = [];
        if (length > 5) {
            let xAxis = systime.slice(length - 5);
            datas.forEach((data: any) => {
                series.push(
                    {
                        category: data.title,
                        data: data.value.slice(length - 5),
                    }
                )
            })
            return { xAxis, series}
        } else {
            let xAxis = systime;
            datas.forEach((data: any) => {
                series.push(
                    {
                        category: data.title,
                        data: data.value,
                    }
                )
            })
            return { xAxis, series}
        }
    }

    private typeConvert(value: any, type: any): any {
        if (type.toLowerCase() == "integer") return Number(value);
        if (type.toLowerCase() == "string" || type.toLowerCase() == "text") return String(value);
        if (type.toLowerCase() == "bool" || type.toLowerCase() == "boolean") return value === 'true' || value === true;
        if (type.toLowerCase() == "float") return parseFloat(value);
      }

}

export { DataConfig }