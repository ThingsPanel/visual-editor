
<template>
  <div @click.stop='nihao($event)'> xxx</div>
</template>

<script lang="ts">

import { defineComponent } from "vue";

export default defineComponent({
  name: "RightClickMenu",
  inject: ["getNode","getGraph"],
  data() {
    return {
      percentage: 80,
    };
  },
  methods:{
    nihao(e:any){
      console.log("453254354354")
      console.log(e)
    }
  },
  mounted() {
    const node = (this as any).getNode();
    const graph = (this as any).getNode();



    console.log(node);
  },
});

</script>

<style scoped>

</style>