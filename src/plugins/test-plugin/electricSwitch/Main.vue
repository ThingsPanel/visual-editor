<template>
  <!-- <div :style="myStyle" style="width: 100px; height: 100%"> -->
  <div :style="myStyle" style="width: 100%; height: 100%">
    <!-- <div style="height: 30px;">
      <span>{{ textValue }}</span>
    </div> -->

    <!-- <el-row>
      <el-col span="10">

        <el-switch :style="buttonStyle" active-color="#13ce66" v-model="switchValue">
        </el-switch>
      </el-col>
      <el-col span="14"> -->


    <div style="width: 100%; height: 100%; overflow: hidden;" @click="handleClick">
      <!-- <img v-if="switchValue" style="height: 50px; " src="/public/asset/picture/switch_close.png" alt="">
        <img v-else style="height: 50px; width: auto;" src="/public/asset/picture/switch_open.png" alt=""> -->
      <img ref="svg1" v-if="switchValue" :style="switchStyle" style="width: 100%; height: 100%"
        src="./image/switch_close.svg" alt="">
      <img ref="svg2" v-else :style="switchStyle" style="width: 100%; height: 100%" src="./image/switch_open.svg" alt="">
      <!-- <svg src="./image/switch_open.svg" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" fill="blue" />
        </svg>
        <h1>sss</h1>
        <embed src="./image/switch_open.svg" type="image/svg+xml" /> -->


      <!-- <h1>222</h1>
        <div>
          <svg src="./image/switch_open.svg" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
            <use href="./image/switch_open.svg" />
          </svg>
        </div> -->

    </div>
    <!-- </el-col>
    </el-row> -->

    <div style="position: relative; width: 100px; height: 160px">

      <!-- <span style="position: absolute; top:4px;left:30px">闭/合</span> -->

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
      switchValue: true,
      textValue: "",
      switchHeight: 100,
      switchWidth: 100,
      switchColor: styleData.switchColor,
      switchDisplay: true,
      // switchStyle: {
      //   transform: "translateX(100px)",
      //   filter: "drop-shadow(-100px 0px 0px " + this.switchColor + ")",
      // }
    };
  },
  computed: {
    switchStyle() {
      console.log("this.switchWidth, this.switchHeight")
      console.log(this.switchWidth, this.switchHeight)
      return {
        height: this.switchHeight,
        width: this.switchWidth,
        transform: "translateX(" + this.switchWidth + "px)",
        filter: "drop-shadow(-" + this.switchWidth + "px 0px 0px " + this.switchColor + ")",
      }
    },
    buttonStyle() {
      return {
        display: this.switchDisplay ? "block" : "none",
      }
    },
  },
  // mounted() {
  //   this.$nextTick(() => {
  //     const element1 = this.$refs.svg1;
  //     const element2 = this.$refs.svg2;

  //     const resizeObserver = new ResizeObserver(entries => {
  //       for (let entry of entries) {
  //         this.objectWidth = entry.contentRect.width;
  //       }
  //     });

  //     resizeObserver.observe(element1);
  //     // resizeObserver.observe(element2);
  //   });
  // },
  watch: {
    style: {
      handler: function (val, oldVal) {
        let { switchColor, switchDisplay, describe } = val;
        this.switchColor = switchColor;
        this.switchDisplay = switchDisplay;
        this.textValue = describe;
        console.log("text.Main.style", val, oldVal);
        if (JSON.stringify(val) === "{}") return;
        this.myStyle = val;
      },
      immediate: true,
      deep: true,
    },
    // value: {
    //   handler: function (val) {
    //     if (!val) {
    //       this.textValue = "文本";
    //     } else {
    //       this.textValue = val;
    //     }
    //     console.log("text.Main.value", this.textValue);
    //   },
    //   immediate: true,
    // },
  },
  methods: {
    handleClick(e) {
      if (this.switchValue == false) {
        this.switchValue = true;
      } else {
        this.switchValue = false;
      };
      console.log("change", this.switchValue)

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