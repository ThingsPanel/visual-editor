<!-- 节点基础属性 -->
<template>
    <el-form v-model="formData">
        <el-form-item label="名称:">
            <el-input disabled v-model="formData.shape"></el-input>
        </el-form-item>

        <el-form-item label="位置:">
            <el-row :gutter="10">
                <el-col :span="12" ><el-input type="number" v-model="formData.position.x"></el-input></el-col>
                <el-col :span="12"><el-input type="number" v-model="formData.position.y"></el-input></el-col>
            </el-row>
        </el-form-item>

        <el-form-item label="尺寸:">
            <el-row :gutter="10">
                <el-col :span="12" ><el-input type="number" v-model="formData.size.width"></el-input></el-col>
                <el-col :span="12"><el-input type="number" v-model="formData.size.height"></el-input></el-col>
            </el-row>
        </el-form-item>

        <el-form-item label="层级:">
            <el-input type="number" v-model="formData.zIndex"></el-input>
        </el-form-item>
        
        <!-- <el-form-item label="对齐:">
            <el-input></el-input>
        </el-form-item> -->
    </el-form>
  
</template>

<script setup lang="ts">
import { ref, reactive, watch, watchEffect } from "vue";
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    }
})
const formData = ref<any>({
    shape: "",
    zIndex: 0,
    size: {
        width: 0,
        height: 0
    },
    position: {
        x: 0,
        y: 0
    }
})
watchEffect(() => {
    console.log('BaseAttr.watchEffect.props.data', { ...props.data })
    if (props.data) {
        formData.value = { 
            shape: props?.data?.shape,
            zIndex: props?.data?.zIndex,
            size: {
                width: props?.data?.size?.width,
                height: props?.data?.size?.height
            },
            position: {
                x: props?.data?.position?.x,
                y: props?.data?.position?.y
            },

         };
    }
})

const emit = defineEmits(["onChange"]);
watch(formData, (val) => {
    // 当自定义属性改变时，传递给Main.vue的style属性
    console.log('BaseNode.Attribute.watch.formData', {...val})
    const style = JSON.parse(JSON.stringify(val))
    emit("onChange", { baseStyle: style });
}, { deep: true })


</script>

<style lang="scss" scoped>

</style>