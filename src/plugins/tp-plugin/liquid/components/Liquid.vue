<template>
    <div :id="containerId" style="width:100%;height: 100%"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted, nextTick } from "vue"
import { Liquid } from '@antv/g2plot';
import { defaultOption, getOptionData } from '../default'
import { randomString } from '@/utils'

const props = defineProps({
    value: {
        type: [String, Number],
        default: 1
    },
    style: {
        type: Object,
        default: () => ({})
    },
    id: {
        type: String,
        default: ""
    }
})
const containerId = props.id || randomString(8);
let liquidPlot: any = null;
let isInitializing = false;
onMounted(() => {
    initLiquid();
})

const initLiquid = (_callback?: Function) => {
    if (isInitializing) return;
    isInitializing = true;
    if (liquidPlot) {
        isInitializing = false;
        _callback && _callback();
        return;
    }
    nextTick(() => {
        console.log('initLiquid.style', props.style)
        const option: any = getOptionData({...defaultOption});
        const container: HTMLElement = <HTMLElement>document.getElementById(containerId);
        console.log('Liquid.container', containerId, container)
        liquidPlot = new Liquid(container, option);
        liquidPlot.render();
        if (props.style.shape) {
            liquidPlot.update(getOptionData({...props.style}));
        }
        loop(props.style?.isLoop || defaultOption.isLoop);
        isInitializing = false;
        _callback && _callback();
    })
}

let timer: any = null;
watch(() => props.style, (val) => {
    console.log('Liquid.style', liquidPlot, val)
    if (!val.shape) return;
    initLiquid(() => {
        liquidPlot.update(getOptionData(val));
        loop(val.isLoop);
    })
})

watch(() => props.value, (val) => {
    console.log('Liquid.value1', val)
    if (!liquidPlot || !val) return;

    let num = (Number(val) / 100).toFixed(2);
    console.log('Liquid.value2', num)

    liquidPlot.changeData(Number(num));
});

const loop = (isLoop: boolean) => {
    if (!isLoop) {
        clearInterval(timer);
        timer = null;
        return;
    }
    if (timer) return;
    let percent = 0.01;
    timer = setInterval(() => {
        if (percent >= 1) {
            percent = 0;
        }
        percent += 0.01;
        liquidPlot.changeData(percent)
    }, 100)
}

onUnmounted(() => {
    clearInterval(timer);
})

</script>

<style lang="scss" scoped></style>