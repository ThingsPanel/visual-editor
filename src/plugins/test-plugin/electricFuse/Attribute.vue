<template>
    <div></div>
    <el-collapse v-model="activeNames">
        <el-collapse-item title="样式" name="style">
            <el-form v-model="formData" label-width="80px" label-position="left">
                <el-form-item label="颜色">
                    <tp-color-picker v-model="formData.objectColor" />
                </el-form-item>
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
    }
}
</script>
  
<style lang="scss" scoped></style>