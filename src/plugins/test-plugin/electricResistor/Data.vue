<template>
  <div style="height:100%">

    <el-form v-model="formData" label-width="80px" label-position="left">

      <el-form-item label="电阻值">
        <el-input v-model="formData.value" type="number" />
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        value: 0
      },
    }
  },
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