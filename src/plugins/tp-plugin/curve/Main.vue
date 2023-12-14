<!--
 * @Author: chaoxiaoshu-mx leukotrichia@163.com
 * @Date: 2023-06-02 18:07:46
 * @LastEditors: chaoxiaoshu-mx leukotrichia@163.com
 * @LastEditTime: 2023-11-16 12:04:26
 * @FilePath: \tp-editor\src\plugins\tp-plugin\curve\Main.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <Line id="yibiaopan" :value="value" :formData="formData" ></Line>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";

import Line from './components/Curve.vue'
export default defineComponent({
  components: {
    Line,
  },
  props: {
    value: {
      type: [Object],
      default: () => ({})
    },
    data: {
      type: [Object, String, Number],
      default: () => {
        return {};
      },
    },
    style: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      formData: {},
    }
  },
  watch: {
    data: {
      handler(val) {
      },
      deep: true
    },
    style: {
      handler(val) {
        console.log("Main.style", val);
        this.formData = val
      },
      deep: true
    }
  },
  // computed: {
  //   formData1() {
  //       if (JSON.stringify(this.value) !== "{}") {
  //           return this.value;
  //       } else {
  //           return {};
  //       }
  //   }
  // },
  methods: {
    changeData(data: any) {
      this.formData = JSON.parse(JSON.stringify(data));
      console.log("Main.data", this.formData);
    }
  }
})

</script>

<style lang="scss" scoped></style>