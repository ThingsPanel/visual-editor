<template>
    <div>
        <el-switch style="width: 100%;height: 100%"
            :style="'--el-switch-on-color:' + myStyle.onColor + ';--el-switch-off-color:' + myStyle.offColor"
            v-model="switchValue" :size="myStyle.size" :loading="loading" :before-change="beforeChange"></el-switch>
    </div>
</template>

<script>
import { defaultStyle } from "./default";
export default {
    components: {},
    props: {
        style: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            switchValue: true,
            myStyle: defaultStyle,
            loading: false
        }
    },
    watch: {
        style: {
            handler: function (val, oldVal) {
                console.log('switch.Main.style', val, oldVal)
                if (JSON.stringify(val) === "{}") return;
                this.myStyle = { ...val };
            },
            immediate: true,
            deep: true
        },
    },
    methods: {
        beforeChange() {
            console.log("switch.Main.beforeChange", this.switchValue)
            this.loading = true;
            return new Promise((resolve) => {
                this.$emit("change", {
                    switch: !this.switchValue
                }, () => {
                    this.loading = false;
                    resolve(true)
                });
            })
        }
    }
}
</script>
<style lang="scss" scoped></style>