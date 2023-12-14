<template>
  <el-dialog v-model="dialogVisible" title="发布" width="800px">
    <div class="grid justify-items-center">
      <el-form ref="ruleFormRef" :model="state" :rules="rules" require-asterisk-position="left" label-width="100"
        label-position="left" style="width: 560px">
        <el-form-item label="大屏名称:">
          <el-input v-model="data.visualName" readonly></el-input>
        </el-form-item>

        <el-form-item label="缩略图:" prop="icon">
          <div class="relative">
            <img class="w-40 h-40" v-if="state.icon" :src="`${oss}/${state.icon}`" />
            <el-button v-else>上传</el-button>
            <input
              type="file"
              class="absolute z-10 inset-0 opacity-0"
              @change="uploadIcon"
              accept="image/png,image/jpg,image/jpeg"
            />
          </div>
        </el-form-item>

        <el-form-item label="说明:">
          <el-input type="textarea" :rows="10" v-model="state.description"></el-input>
        </el-form-item>

      </el-form>
    </div>
    <template #footer>
      <div class="grid justify-items-end">
        <span class="dialog-footer ">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submit(ruleFormRef)">确认</el-button>
        </span>
      </div>
    </template>

  </el-dialog>
</template>
  
<script setup lang="ts">
import { ref, reactive, computed, inject, onMounted } from "vue";
import type { FormInstance, FormRules } from 'element-plus'
import { MarketApi } from '@/api/market'
import { message } from '@/utils';
import { CanvasConfig } from "@/editor/config";

const params: any = inject("params", null);
const localUrl = import.meta.env.VITE_BASE_URL || document.location.origin;
const oss = import.meta.env.VITE_OSS

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:visible'])
const dialogVisible = computed({
  get() {
    return props.visible
  },
  set(val) {
    emit("update:visible", val)
  }
});

const state = reactive<{
  zh_name: string;
  icon: string;
  description: string;
  json: string;
}>({
  zh_name: "",
  icon: "",
  description: "",
  json: ""
});

onMounted(() => {
});
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  icon: [
    { required: true, message: '请上传缩略图', trigger: 'blur' },
  ],
})
const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      state.zh_name = props.data.visualName;
      state.json = JSON.stringify(CanvasConfig.getInstance().toJSON());
      let res = await MarketApi.addScreen(state)
      if (res.data.id) {
        message.success("发布成功，请等待管理员审核")
        dialogVisible.value = false
      } else {
        message.error("发布失败")
      }
    } 
  });
};

/**
 * 上传缩略图
 */
const uploadIcon = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    const res = await MarketApi.upload(file)
    state.icon = res.data.name
  }
}

</script>
  
<style lang="scss" scoped></style>