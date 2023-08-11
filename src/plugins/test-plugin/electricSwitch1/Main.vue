<template>
  <div :style="myStyle" style="width: 100%; height: 100%;" @click="handleClick">
    <div style="overflow: hidden;position: relative;">

      <img ref="svg" v-if="switchValue" :style="objectStyle" style="width: 100%; height: 100%" src="./image/switch.svg"
        alt="">
      <img ref="svg1" v-else :style="objectStyle1" style="width: 100%; height: 100%" src="./image/switch_closed.svg"
        alt="">
      <!-- <img ref="svg" :style="objectStyle" style="width: 100%; height: 100%" src="./image/switch.svg" alt="">
      <img ref="svg1" :style="objectStyle1" style="width: 100%; height: 100%" src="./image/switch_closed.svg" alt=""> -->
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
      switchValue: true,
      myStyle: styleData,
      objectHeight: 80,
      objectWidth: 80,
      objectWidth1: 80,
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
        // display: this.switchValue ? "block" : "none",
        height: this.objectHeight,
        width: this.objectWidth,
        transform: "translateX(" + this.objectWidth + "px)",
        filter: "drop-shadow(-" + this.objectWidth + "px 0px 0px " + color + ")",
      }
    },
    objectStyle1() {
      let color = this.objectColor;
      if (color == undefined) {
        color = "#000000";
      }
      return {
        display: !this.switchValue ? "block" : "none",
        height: this.objectHeight,
        width: this.objectWidth1,
        transform: "translateX(" + this.objectWidth1 + "px)",
        filter: "drop-shadow(-" + this.objectWidth1 + "px 0px 0px " + color + ")",
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      const element = this.$refs.svg;
      const element1 = this.$refs.svg1;

      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          this.objectWidth = entry.contentRect.width;
          this.objectWidth1 = entry.contentRect.width;
        }
      });

      resizeObserver.observe(element);

      const resizeObserver1 = new ResizeObserver(entries => {
        for (let entry of entries) {
          this.objectWidth1 = entry.contentRect.width;
          this.objectWidth = entry.contentRect.width;
        }
      });

      resizeObserver1.observe(element1);
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
  methods: {
    handleClick(e) {
      if (this.switchValue == false) {
        this.switchValue = true;
      } else {
        this.switchValue = false;
      }

      new Promise((resolve) => {
        this.$emit("change", {
          switch: !this.switchValue,
        }, () => {
          this.loading = false;
          resolve(true)
        });
      })
    },
  },
};
</script>
<style lang="scss" scoped></style>