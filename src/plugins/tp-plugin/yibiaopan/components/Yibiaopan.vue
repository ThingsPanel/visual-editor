<!--
 * @Author: chaoxiaoshu-mx leukotrichia@163.com
 * @Date: 2023-06-07 15:37:53
 * @LastEditors: chaoxiaoshu-mx leukotrichia@163.com
 * @LastEditTime: 2023-11-09 11:04:08
 * @FilePath: \tp-editor\src\plugins\tp-plugin\yibiaopan\components\Yibiaopan.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div :id="id" style="width:100%;height:100%"></div>
</template>
  
<script lang="ts">
import { Gauge } from '@antv/g2plot';
import { defineComponent } from "vue";
import { randomString } from "@/utils"
import { optionData } from '../default';
export default defineComponent({
    name: "Gauge",
    components: {
        Gauge
    },
    props: {
        id: {
            type: String,
            required: true,
            default: "gauge"
        },
        formData: {
            type: Object,
            default: () => {
                return {};
            },
        },
        value: {
            type: [Object, String, Number],
            default: ""
        }
    },
    data() {
        return {
            id: "container_gauge_" + randomString(10),
            gauge: <any>null,
            range: "",
            pin: "",
            pointer: "",
            option: optionData
        }
    },
    mounted() {
        this.render();
    },
    watch: {
        value: {
            handler(val) {
                if (val) {
                    this.gauge.changeData(Number(Number(val / 100).toFixed(2)));
                }
            }
        },
        formData: {
            handler(val, oldVal) {
                if (JSON.stringify(val) === "{}") return;
                if (JSON.stringify(val) === JSON.stringify(oldVal)) return;
                this.option.statistic.content.formatter = (data: any) => {
                    console.log('yibiaopan.formatter', data)
                    const percent: number = data?.percent || 0;
                    return `${val.text}: ${(percent * 100).toFixed(0)}${val.unit || ''}`
                }
                // 字体颜色.statistic
                this.option.statistic.content.style.color = val.fontColor || "#000";
                // 字体大小
                this.option.statistic.content.style.fontSize = val.fontSize || '15px';
                // 进度条颜色
                this.option.range.color = 'l(0) 0:' + val.progressColor1 + ' 1:' + val.progressColor2 || 'l(0) 0:#B8E1FF 1:#3D76DD';
                // 是否显示指针
                this.option.indicator.pointer.style.stroke = val.pointerShow ? val.pointerColor : "transparent";
                // 是否显示圆心
                this.option.indicator.pin.style.stroke = val.pointerShow ? val.pinColor : "";
                // 是否显示标签和刻度
                this.option.axis.visible = val.tagShow || false;


                console.log('yibiaopan.formData.option', this.option)
                this.gauge.update(this.option);
            },
            deep: true
        }
    },
    methods: {
        render() {
            this.gauge = new Gauge(this.id, this.option);
            console.log('yibiaopan.formData', this.formData)
            this.gauge.render();
        }
    }
})

</script>
  
<style lang="scss" scoped></style>