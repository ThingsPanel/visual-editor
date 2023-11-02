<template>
    <div :id="id" style="width:100%;height:100%;float: left;" :style="{
        borderRadius: background.bordereduse + '%',
        backgroundColor: bgColorAndOpicity,
        border: `${background.borderSize + 'px'} solid ${background.borderColor}`,
    }">
    </div>
</template>
  
<script lang="ts">
import { Line } from '@antv/g2plot';
import { defineComponent } from "vue";
import { randomString } from "@/utils"
export default defineComponent({
    name: "Gauge",
    components: {
        Line
    },
    props: {
        id: {
            type: String,
            required: true,
            default: "gauge"
        },
        formData: {
            type: [Object],
            default: () => {
                return {};
            },
        },
        formData1: {
            type: [Array, Object, String, Number],
            default: () => {
                return {};
            },
        },
        value: {
            type: [Object],
            default: () => ({})
        }
    },
    data() {
        return {
            id: "container_curve_" + randomString(10),
            line: null,
            data: [
                {
                    xAxis: '周一',
                    scales: 10
                },
                {
                    xAxis: '周二',
                    scales: 20
                },
                {
                    xAxis: '周三',
                    scales: 60
                },
                {
                    xAxis: '周四',
                    scales: 12
                }
            ],
            border: "border:5px solid red",
            padding: 'auto',
            xField: 'Date',
            yField: 'scales',
            xAxis: {
                tickCount: 5,
            },
            slider: {
                start: 0.1,
                end: 0.9,
            },
            background: {
                Color: "",
                XColor: "",
                XTextColor: "",
                XfontSize: "",
                bgColor: "",
                borderColor: "",
                borderSize: "",
                bordereduse: 0,
                fontColor: "",
                fontSize: 20,
                slidingblock: 10,
            },
            bgColorAndOpicity: '#FFFFFF',
            keydata: {
                value: "",
                options: ['静态数据', '动态数据', '设备数据'],
                selectedValue: '',
            },
        }
    },
    mounted() {

        console.log('curve.Main.mounted0', this.data);
        let temp = this.getCurveData(this.value);
        let data = temp || this.data;
        console.log('curve.Main.mounted1', this.id, data);
        (this.line as any) = new Line(this.id, {
            data: data,
            padding: this.padding as any,
            xField: 'xAxis',
            yField: 'scales',
            xAxis: {
                tickCount: 5,
            },
            seriesField: 'category',
        });
        (this.line as any).render();
    },
    watch: {
        formData: {
            handler(val) {
                if (!val || JSON.stringify(val) === "{}") return;
                console.log(val);
                function hexToRgba(hex: any, alpha: any) {
                    if (!hex?.slice) return "rgba(" + 0 + ", " + 0 + ", " + 0 + ", " + alpha + ")";
                    var r = parseInt(hex.slice(1, 3), 16);
                    var g = parseInt(hex.slice(3, 5), 16);
                    var b = parseInt(hex.slice(5, 7), 16);
                    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
                }
                this.background = val;
                this.bgColorAndOpicity = hexToRgba(this.background.Color, this.background.slidingblock as any / 10);
                console.log(this.bgColorAndOpicity);

                // console.log((this.line as any).options);
                let Xstyle = {
                    style: {
                        fontSize: 12,
                        fill: '',
                    }
                };
                Xstyle.style.fontSize = Number(val.XfontSize);
                Xstyle.style.fill = val.XTextColor;
                (this.line as any).options.xAxis.label.style = Xstyle.style;

                let Xline = {
                    line: {
                        style: {
                            stroke: ''
                        }
                    }
                };
                Xline.line.style.stroke = val.XColor;
                (this.line as any).options.xAxis.line = Xline.line;

                let Ystyle = {
                    style: {
                        fontSize: 12,
                        fill: '',
                    }
                };
                Ystyle.style.fontSize = Number(val.YfontSize);
                Ystyle.style.fill = val.YTextColor;
                (this.line as any).options.yAxis.label.style = Ystyle.style;

                let Yline = {
                    line: {
                        style: {
                            stroke: ''
                        }
                    }
                };
                Yline.line.style.stroke = val.YColor;
                (this.line as any).options.yAxis.line = Yline.line;
                (this.line as any).render();
            },
            deep: true,
        },
        formData1: {
            handler(val) {
                console.log('formData1', val);
                if (val !== '') {
                    let arr = Array.from(val)
                    let jsonStr = arr.join("").replace(/\s+/g, "");
                    let obj = JSON.parse(jsonStr)
                    let newArr: any[] = []
                    console.log('curve.obj.xAxis', obj.xAxis);

                    obj.xAxis.map((item: any, index: number) => {
                        let newObj = {
                            xAxis: item.slice(10, 15),
                            scales: Number(obj.series[0].data[Number(index)])
                        }
                        newArr.push(newObj)
                    });
                    // this.data
                    console.log('curve.newArr', newArr);
                    // this.data = newArr;
                    if (jsonStr.length > 1) {
                        (this.line as any).options.data = newArr;
                        if (obj.series[0].data[obj.series[0].data.length - 1] !== undefined) {
                            (this.line as any).render()

                        }
                    }
                }

            },
            deep: true,
        },
        value: {
            async handler(val) {
                let data = this.getCurveData(val);
                if (!data) return;
                await this.$nextTick();
                (this.line as any).options.data = data;
                console.log("this.line", this.line);
                (this.line as any).render();
            }
        }
    },
    methods: {
        getCurveData(val: any) {
            if (!val || val === "{}" || JSON.stringify(val) === "{}") return undefined;
            let data: any[] = [];
            let jsonObj = JSON.parse(val);
            /*
                示例：
                {
                    "xAxis": [ "2023-07-25 11:39:40", "2023-07-25 16:23:16", "2023-07-25 16:45:29",
                        "2023-07-25 17:29:11","2023-07-25 18:05:18"],
                    "series": [
                        {
                            "category": "温度",
                            "data": [ "11","22","33","55","11" ]
                        },
                        {
                            "category": "湿度",
                            "data": [ "22","33","44","44","22" ]
                        }
                    ]
                }
            */
            // 遍历时间
            for (let i = 0; i < jsonObj.xAxis.length; i++) {
                    const systime = jsonObj.xAxis[i];
                    // const hour = (new Date(systime)).getHours()
                    // const min = (new Date(systime)).getMinutes()
                    // 遍历series
                    jsonObj.series.forEach((serie: any) => {
                        data.push({
                            category: serie.category || serie.name,
                            xAxis: systime,
                            scales: Number(serie.data[i])
                        })
                    })
            }
            return data;
        }
    }
})

</script>

  
<style lang="scss" scoped>
.header {
    width: 50px;
    position: absolute;
    left: 0;
    top: 10px;
}
</style>
