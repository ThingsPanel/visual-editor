<template>
  <el-dialog v-model="dialogVisible" title="分享" width="800px">
    <el-form label-width="120px" label-position="left" class="mx-10" >
      <el-form-item label="分享链接">
        <el-row class="w-full" gutter="10">
            <el-col :span="20">
                <el-input v-model="data.shareUrl" readonly></el-input>
            </el-col>
            <el-col :span="4">
                <el-button id="share-btn" @click="handleCopyShareUrl">复制链接</el-button>
            </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="谁可以查看">
        <el-row class="w-full">
            <el-col :span="3">
                <el-radio-group v-model="data.permission" type="vertical">
                    <el-radio label="0" size="small" class="my-5">仅我自己</el-radio>
                    <el-radio label="1" size="small">所有人可查看</el-radio>
                </el-radio-group>
            </el-col>
        </el-row>
        
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import Clipboard from 'clipboard'
import { message } from '@/utils/tool'
import { reactive, computed, inject, onMounted, watch } from "vue";
import { VisualAPI } from '@/api';

const params: any = inject("params", null)
const urlPrefix = import.meta.env.VITE_BASE_PATH  || '/visual/';
let noPermissionUrl = "";
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible'])
const dialogVisible = computed({
    get() {
        return props.visible
    },
    set(val) {
        emit("update:visible", val)
    }
})
watch(dialogVisible, async (newValue, oldValue) => {
    if (newValue) {
        let { data: result } = await VisualAPI.getJsonDataById({ id: params?.id, current_page: 1, per_page: 10 })
        if (result.code === 200) {
            let shareID = result.data?.list?.[0]?.share_id;
            if (shareID) {
                noPermissionUrl = `${window.location.origin}${urlPrefix}share/${shareID}`
            }
        }

        // 不存在分享链接时，生成分享链接
        if (!noPermissionUrl) {
            console.error('noPermissionUrl', noPermissionUrl)
            let { data: result } = await VisualAPI.generateShareID({ id: params?.id })
            if (result.code === 200) {
                let shareID = result.data?.share_id;
                if (shareID) {
                    noPermissionUrl = `${window.location.origin}${urlPrefix}share/${shareID}`
                }
            console.error('noPermissionUrl', noPermissionUrl)

            }
        }
    }
});

const data = reactive({
  shareUrl: window.location.href,
  permission: "0",
})


watch(data, newValue => {
    if (newValue.permission === "1") {
        if (noPermissionUrl) {
            newValue.shareUrl = noPermissionUrl;
        } else {
            newValue.shareUrl = '';
        }
    } else if (newValue.permission === "0") {
        newValue.shareUrl = window.location.href;
    }
});
const handleCopyShareUrl = () => {
    var clipboard = new Clipboard('#share-btn', {
        text:function(){
            return data.shareUrl
        },
    });
    message.success('分享链接已复制到粘贴板')
}


</script>

<style lang="scss" scoped>

</style>