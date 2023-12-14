<!--
 * @Author: chaoxiaoshu-mx leukotrichia@163.com
 * @Date: 2023-08-11 11:34:35
 * @LastEditors: chaoxiaoshu-mx leukotrichia@163.com
 * @LastEditTime: 2023-11-22 11:14:36
 * @FilePath: \tp-editor\src\plugins\tp-plugin\text\Main.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div :style="myStyle" style="width:100%;height:100%;overflow-y: auto" @dblclick="handleDBClick">
        <span v-if="mode==='view'" class="whitespace-pre-wrap">{{ textValue }}</span>
        <el-input type="textarea" id="inputRef" ref="inputRef" style="width:100%;height:100%" v-if="mode==='edit'" v-model="textValue" @blur="onChange" @keyup.enter.native="onChange"></el-input>
    </div>
</template>

<script>
import initData from "./init.json";
export default {
  props: {
    value: {
      type: [String, Object],
      default: '文本'
    },
    style: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      textValue: '文本',
      mode: "view"
    }
  },
  computed: {
    myStyle() {
      return { ...this.style, fontSize: `${this.style.fontSize}px`, borderWidth: `${this.style.borderWidth}px` }
    }
  },
  watch: {
    value: {
      handler: function(val) {
        if (!val) {
          this.textValue = "文本";
        } else {
          this.textValue = val;
        }
      },
      immediate: true
    }
  },
  mounted() {
    console.log(this.$style({ a: 123}))
  },
  methods: {
    handleDBClick(e) {
      this.mode = "edit";
      this.$nextTick(() => {
        this.$refs.inputRef.focus();
      })
    },
    onChange() {
      this.mode = "view";
      this.$emit("onChange", {
          data: { bindType: "static", static: this.textValue }
        });
    }
  }
}
</script>
<style lang="scss" scoped></style>