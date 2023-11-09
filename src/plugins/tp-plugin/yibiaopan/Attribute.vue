<template>
    <el-collapse v-model="activeNames" accordion>
      <el-collapse-item title="背景与边框" name="background">
        <el-form v-model="formData.background" label-width="140px" label-position="left">
  
          <el-form-item label="背景颜色">
            <tp-color-picker v-model="formData.background.backgroundColor" />
          </el-form-item>

          <el-form-item label="边框宽度">
            <el-input type="number" min="0" v-model="formData.background.borderWidth" />
          </el-form-item>

          <el-form-item label="边框颜色">
            <tp-color-picker v-model="formData.background.borderColor" />
          </el-form-item>

        </el-form>
      </el-collapse-item>

      <el-collapse-item title="图表设置" name="dashboard">
        <el-form v-model="formData.dashboard" label-width="140px" label-position="left">

          <el-form-item label="文本">
            <el-input v-model="formData.dashboard.text"></el-input>
          </el-form-item>

          <el-form-item label="单位">
            <el-input v-model="formData.dashboard.unit"></el-input>
          </el-form-item>
  
          <el-form-item label="字体大小">
            <el-input type="number" min="1" v-model="formData.dashboard.fontSize"></el-input>
          </el-form-item>
  
          <el-form-item label="字体颜色">
            <tp-color-picker v-model="formData.dashboard.fontColor" />
          </el-form-item>
  
            <el-form-item label="进度条颜色">
              <tp-color-picker v-model="formData.dashboard.progressColor1" />
              <tp-color-picker v-model="formData.dashboard.progressColor2" />

            </el-form-item>
            <el-form-item label="显示指针">
              <el-switch v-model="formData.dashboard.pointerShow" />
            </el-form-item>
            <el-form-item label="指针颜色" v-if="formData.dashboard.pointerShow">
              <tp-color-picker v-model="formData.dashboard.pointerColor" />
            </el-form-item>
            <el-form-item label="圆心颜色" v-if="formData.dashboard.pointerShow">
              <tp-color-picker v-model="formData.dashboard.pinColor" />
            </el-form-item>
            <el-form-item label="显示标签">
              <el-switch v-model="formData.dashboard.tagShow" />
            </el-form-item>
      
        </el-form>
        
      </el-collapse-item>

    </el-collapse>
  </template>
  
  <script lang="ts">
  import { defineComponent } from "vue";
  import { styleData } from './default'
  export default defineComponent({
    props: {
      data: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        activeNames: 'background',
        formData: styleData
      }
    },
    watch: {
      formData: {
        handler(val) {
          let temp = JSON.parse(JSON.stringify(val));
          temp.dashboard.fontSize = temp.dashboard.fontSize + 'px'
          temp.background.borderWidth = temp.background.borderWidth + 'px'
          this.$emit("onChange", {
            style: temp
          });
        },
        deep: true
      }
    },
    mounted() {
      if (this.data) {
          const jsonStr = JSON.stringify(this.data);
          console.log('yibiaopan.jsonStr', jsonStr)
          if (jsonStr === '{}') return;
          const jsonObj = JSON.parse(jsonStr);
          jsonObj.fontSize = jsonObj.dashboard?.fontSize?.toString().replace("px", "") || styleData?.dashboard?.fontSize
          jsonObj.borderWidth = jsonObj.background?.borderWidth.toString().replace("px", "") || styleData?.background?.borderWidth
          this.formData = jsonObj;
      }
    },
  })
  
  
  </script>
  
  <style lang="scss" scoped>
  
  </style>