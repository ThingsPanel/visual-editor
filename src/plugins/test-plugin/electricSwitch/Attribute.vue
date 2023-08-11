<template>
    <div></div>
    <el-collapse v-model="activeNames">
        <el-collapse-item title="样式" name="style">


            <el-form v-model="formData" label-width="80px" label-position="left">

                <!-- <el-form-item label="描述">
                    <el-input v-model="formData.describe" />
                </el-form-item> -->

                <el-form-item label="颜色">
                    <tp-color-picker v-model="formData.switchColor" />
                </el-form-item>

                <!-- <el-form-item label="展示按钮">
                    <el-switch v-model="formData.switchDisplay"></el-switch>
                </el-form-item> -->
            </el-form>
        </el-collapse-item>
    </el-collapse>
</template>
  
<script>
import { styleData } from './default'
export default {
    props: {
        data: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            activeNames: 'style',
            formData: JSON.parse(JSON.stringify(styleData)),
            // formData: {
            //     describe: "",
            //     switchColor: "#558ABB",
            //     switchDisplay: true,
            // },
        }
    },
    watch: {
        formData: {
            handler(val) {
                // 当自定义属性改变时，传递给Main.vue的style属性
                this.$emit("onChange", {
                    style: { ...val, fontSize: val.fontSize + 'px', borderWidth: val.borderWidth + 'px' }
                });
            },
            deep: true
        },
        data: {
            handler(val) {
                console.log('text.Attribute.watch.data', val)
                const jsonStr = JSON.stringify(val);
                if (jsonStr !== '{}') {
                    const jsonObj = JSON.parse(jsonStr);
                    // jsonObj.fontSize = jsonObj.fontSize?.toString().replace("px", "") || styleData.fontSize
                    // jsonObj.borderWidth = jsonObj.borderWidth?.toString().replace("px", "") || styleData.borderWidth
                    this.formData = jsonObj;
                } else {
                    this.formData = JSON.parse(JSON.stringify(styleData));
                }
            },
            immediate: true,
            deep: true
        }
    }
}
</script>
  
<style lang="scss" scoped></style>