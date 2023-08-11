<template>
  <div style="height:100%">
    <div class="w-full">
      <slot></slot>
    </div>
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
  watch: {
    formData: {
      handler(val) {
        this.$emit("onChange", {
          data: { bindType: this.bindType, ...val }
        });
      },
      deep: true
    },
    data: {
      handler(val) {
        if (JSON.stringify(val) !== "{}") {
          this.formData = JSON.parse(JSON.stringify(val));
        }
      },
    }
  }
}
</script>
<style lang="scss" scoped>
.el-radio.el-radio--small {
  margin-right: 10px
}
</style>