<template>
    <div :id="id" style="width:100%;height:100%;float: left;" :style="{
        borderRadius: background.bordereduse + '%',
        backgroundColor: bgColorAndOpicity,
        border: `${background.borderSize + 'px'} solid ${background.borderColor}`,
    }">
    </div>
</template>
  

<script>
/*
const line = new Line('container', {
      data,
      padding: 'auto',
      xField: 'Date',
      yField: 'scales',
      xAxis: {
        // type: 'timeCat',
        tickCount: 5,
      },
    });

    line.render();
[
  {
    "Date": "2010-01",
    "scales": 1998
  },
  {
    "Date": "2010-02",
    "scales": 1850
  },
  {
    "Date": "2010-03",
    "scales": 1720
  },
  {
    "Date": "2010-04",
    "scales": 1818
  },
  {
    "Date": "2010-05",
    "scales": 1920
  }
]
*/
import { Line } from '@antv/g2plot';
import { defineComponent } from "vue";
import { randomString } from "@/utils"
import initData from "../init.json"
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
        // 初始化图表
        this.initPlot();
    },
    watch: {
        // 样式
        formData: {
            handler(val) {
                console.log("====Curve.formData", val);

                if (!val || JSON.stringify(val) === "{}") return;
                return;
                function hexToRgba(hex, alpha) {
                    if (!hex?.slice) return "rgba(" + 0 + ", " + 0 + ", " + 0 + ", " + alpha + ")";
                    var r = parseInt(hex.slice(1, 3), 16);
                    var g = parseInt(hex.slice(3, 5), 16);
                    var b = parseInt(hex.slice(5, 7), 16);
                    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
                }
                this.background = val;
                this.bgColorAndOpicity = hexToRgba(this.background.Color, this.background.slidingblock / 10);
                console.log(this.bgColorAndOpicity);

                let Xstyle = {
                    style: {
                        fontSize: 12,
                        fill: '',
                    }
                };
                Xstyle.style.fontSize = Number(val.XfontSize);
                Xstyle.style.fill = val.XTextColor;
                this.line.options.xAxis.label.style = Xstyle.style;

                let Xline = {
                    line: {
                        style: {
                            stroke: ''
                        }
                    }
                };
                Xline.line.style.stroke = val.XColor;
                this.line.options.xAxis.line = Xline.line;

                let Ystyle = {
                    style: {
                        fontSize: 12,
                        fill: '',
                    }
                };
                Ystyle.style.fontSize = Number(val.YfontSize);
                Ystyle.style.fill = val.YTextColor;
                this.line.options.yAxis.label.style = Ystyle.style;

                let Yline = {
                    line: {
                        style: {
                            stroke: ''
                        }
                    }
                };
                Yline.line.style.stroke = val.YColor;
                this.line.options.yAxis.line = Yline.line;
                this.line.render();
            },
            deep: true,
        },
        
        value: {
            handler(val) {
                if (!val) return;
                if (typeof val === "string") {
                    this.line.changeData(JSON.parse(val));
                } else if (typeof val === "object") {
                    this.line.changeData(val);
                }
            }
        }
    },
    methods: {
        /**
         * @description: 初始化图表
         * @return {*}
         */        
        initPlot(data = initData.data.static) {
            this.line = new Line(this.id, {
                data,
                padding: this.padding,
                xField: 'Date',
                yField: 'scales',
                xAxis: {
                    tickCount: 5,
                },
                seriesField: 'category',
            });
            console.log("====initPlot")
            this.line.render();
            // setTimeout(() => {
                
            // }, 1000);
        },
        // getCurveData(val) {
        //     if (!val || val === "{}" || JSON.stringify(val) === "{}") return undefined;
        //     let data = [];
        //     console.debug("====getCurveData.val", val)
        //     let jsonObj = JSON.parse(JSON.stringify(val));
         
        //     // 遍历时间
        //     if (Array.isArray(jsonObj.xAxis)) {
        //         for (let i = 0; i < jsonObj.xAxis.length; i++) {
        //                 const systime = jsonObj.xAxis[i];
        //                 // const hour = (new Date(systime)).getHours()
        //                 // const min = (new Date(systime)).getMinutes()
        //                 // 遍历series
        //                 jsonObj.series.forEach((serie) => {
        //                     data.push({
        //                         category: serie.category || serie.name,
        //                         xAxis: systime,
        //                         scales: Number(serie.data[i])
        //                     })
        //                 })
        //         }
        //     }
        //     return data;
        // }
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
