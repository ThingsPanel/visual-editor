<template>
  <div style="width: 100%;height: 100%" :style="myStyle.background">
    <Yibiaopan id="yibiaopan" :style="myStyle.dashboard" :formData="myStyle.dashboard" :value="value"></Yibiaopan>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";
import Yibiaopan from "./components/Yibiaopan.vue";
import { styleData } from "./default";

export default defineComponent({
  components: {
    Yibiaopan,
  },
  props: {
    value: {
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
      formData: JSON.parse(JSON.stringify(styleData))
    }
  },
  watch: {
    myStyle: {
      handler(val) {
        console.log("Yibiaopan.Main.style", val);
      },
      deep: true
    }
  },
  computed: {
    myStyle() {
      if (JSON.stringify(this.style) !== "{}") {
        return this.style;
      } else {
        return JSON.parse(JSON.stringify(styleData));
      }
    },
  },
  methods: {
   
  }
})

</script>

<style lang="scss" scoped>

</style>