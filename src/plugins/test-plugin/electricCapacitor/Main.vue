<template>
  <div :style="myStyle" style="width: 100%; height: 100%">
    <div style="overflow: hidden;position: relative;">

      <img ref="svg" :style="objectStyle" style="width: 100%; height: 100%" src="./image/capacitor.svg" alt="">
    </div>

  </div>
</template>

<script>
import { styleData } from "./default";

export default {
  props: {
    style: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      myStyle: styleData,
      objectValue: true,
      textValue: "",
      objectHeight: "70px",
      objectWidth: "100px",
      objectColor: styleData.objectColor,
      objectDisplay: true,
    };
  },
  computed: {
    objectStyle() {
      let color = this.objectColor;
      if (color == undefined) {
        color = "#000000";
      }
      return {
        height: this.objectHeight,
        width: this.objectWidth,
        transform: "translateX(" + this.objectWidth + "px)",
        filter: "drop-shadow(-" + this.objectWidth + "px 0px 0px " + color + ")",
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      const element = this.$refs.svg;
      console.log("element", element)

      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          this.objectWidth = entry.contentRect.width;
        }
      });

      resizeObserver.observe(element);
    });
  },
  watch: {
    style: {
      handler: function (val, oldVal) {
        let { objectColor } = val;
        this.objectColor = objectColor;
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
<style lang="scss" scoped></style>