<!--
 * @Author: chaoxiaoshu-mx leukotrichia@163.com
 * @Date: 2023-08-11 11:34:35
 * @LastEditors: chaoxiaoshu-mx leukotrichia@163.com
 * @LastEditTime: 2023-11-15 15:35:59
 * @FilePath: \tp-editor\src\plugins\tp-plugin\text\Attribute.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <el-collapse v-model="activeNames">
        <el-collapse-item title="样式" name="style">
            <el-form v-model="formData" label-width="80px" label-position="left">
                <el-form-item label="字体大小">
                    <el-input type="number" v-model="formData.fontSize"></el-input>
                </el-form-item>

                <el-form-item label="字体颜色">
                    <tp-color-picker v-model="formData.color" />
                </el-form-item>

                <el-form-item label="背景颜色">
                    <tp-color-picker v-model="formData.backgroundColor" />
                </el-form-item>

                <el-form-item label="边框宽度">
                    <el-input type="number" v-model="formData.borderWidth"></el-input>
                </el-form-item>

                <el-form-item label="边框颜色">
                    <tp-color-picker v-model="formData.borderColor" />
                </el-form-item>
                <el-form-item label="对齐方式">
                    <el-select v-model="formData.textAlign" placeholder="对齐方式">
                        <el-option
                            v-for="item in alignOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            />
                    </el-select>
                </el-form-item>
            </el-form>
        </el-collapse-item>
    </el-collapse>
</template>
  
<script>
const alignOptions = [
    {label: '左对齐', value: 'left'},
    {label: '居中对齐', value: 'center'},
    {label: '右对齐', value: 'right'},
    {label: '两端对齐', value: 'justify'},
]
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
            alignOptions,
            activeNames: 'style',
            formData: JSON.parse(JSON.stringify(styleData))
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
                const jsonStr = JSON.stringify(val);
                if (jsonStr !== '{}') {
                    const jsonObj = JSON.parse(jsonStr);
                    jsonObj.fontSize = jsonObj.fontSize?.toString().replace("px", "") || styleData.fontSize
                    jsonObj.borderWidth = jsonObj.borderWidth?.toString().replace("px", "") || styleData.borderWidth
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