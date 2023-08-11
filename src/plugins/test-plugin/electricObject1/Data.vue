<template>
  <div style="height:100%">
    <!-- <el-row style="height:100%">
      <el-input v-model="formData.textValue"></el-input>

    </el-row> -->
  </div>
</template>

<script>
export default {
  // data() {
  //   return {
  //     formData: {
  //       textValue: ""
  //     },
  //   }
  // },
  // watch: {
  //   formData: {
  //     handler(val) {
  //       this.$emit("onChange", {
  //         data: { bindType: this.bindType, ...val }
  //       });
  //     },
  //     deep: true
  //   },
  //   data: {
  //     handler(val) {
  //       if (JSON.stringify(val) !== "{}") {
  //         this.formData = JSON.parse(JSON.stringify(val));
  //       }
  //     },
  //   }
  // }
}
</script>
<style lang="scss" scoped>
.el-radio.el-radio--small {
  margin-right: 10px
}
</style>