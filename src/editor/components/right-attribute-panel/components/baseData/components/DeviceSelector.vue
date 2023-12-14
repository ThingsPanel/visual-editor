<template>
    <!-- 设备数据 -->
    <el-collapse v-model="activeNames">
        <el-collapse-item name="device">
            <template #title>
                <div class="flex justify-between w-full items-center">
                    <span>设备 {{ index }}</span>
                    <el-icon class="header-icon mr-3" @click.stop="handleDelete">
                        <Delete />
                    </el-icon>
                </div>

            </template>
            <el-form>
                <el-form-item label="选择项目">
                    <el-select filterable v-model="state.projectId" placeholder="选择项目">
                        <el-option v-for="item in projectOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>

                <el-form-item v-if="state.projectId" label="选择分组">
                    <el-select filterable v-model="state.groupId" placeholder="选择分组">
                        <el-option v-for="item in groupOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>

                <!-- <el-form-item v-if="state.groupId" label="选择设备">
                    <el-select filterable v-model="state.deviceId" placeholder="选择设备">
                        <el-option v-for="item in deviceOptions" :key="item.value" 
                        :label="item.label + (item.pluginId ? ' [已绑定]' : '')" 
                        :value="item.value" />
                    </el-select>
                </el-form-item> -->

                <el-form-item v-if="state.groupId" label="选择设备">
                    <el-cascader ref="deviceRef" style="width: 100%;margin-right:10px" v-model="state.deviceId"
                        placeholder="选择设备" :options="options.deviceOptions" clearable
                        :props="{ checkStrictly: true, emitPath: false }">
                    </el-cascader>
                </el-form-item>

                <el-form-item v-if="state.deviceId" label="选择属性">
                    <el-select multiple v-model="state.properties" placeholder="选择属性">
                        <el-option v-for="item in options.tslOptions" :key="item.name" :label="item.title" :value="item.name" />
                    </el-select>
                </el-form-item>

            </el-form>
        </el-collapse-item>
    </el-collapse>
</template>

<script setup lang="ts">
import { ref, reactive, watch, toRaw, onMounted, watchEffect } from "vue";
import { Delete } from '@element-plus/icons-vue'
import DeviceAPI from "@/api/device";

const props = defineProps({
    index: Number,
    data: Object
});
const emit = defineEmits(["delete", 'change']);

const activeNames = ref<string[]>(['style']);
const state = reactive<{
    projectId: string,
    projectName: string,
    groupId: string,
    groupName: string,
    deviceId: string,
    deviceName: string,
    pluginId: string,
    property: string,
    propertyTitle: string,
    properties: string[],
    propertyList: any[],
    devices: any[],
}>({
    projectId: '',
    projectName: '',
    groupId: '',
    groupName: '',
    deviceId: '',
    deviceName: '',
    pluginId: '',
    property: '',
    propertyTitle: '',
    properties: [],
    propertyList: [],
    devices: [],
})

const options = reactive({
    deviceOptions: <any>[],
    tslOptions: <any>[]
})
const projectOptions = ref<any>([]);
const groupOptions = ref<any>([]);
const deviceOptions = ref<any>([]);
const tslOptions = ref<any>([]);

watch(() => state, (value) => {
    // emit('change', { index: props.index, ...value})
    emit('change', { index: props.index, ...toRaw(value) })
}, { deep: true })

watch(() => props.data, async (val: any) => {
    if (JSON.stringify(val) === "{}") return;
    // 项目
    state.projectId = val.projectId || "";
    // 分组
    state.groupId = val.groupId || "";
    // 设备
    state.deviceId = val.deviceId || "";
    // 插件
    state.pluginId = val.pluginId || "";
    // 属性
    state.property = val.property || "";
    // 属性数组
    state.properties = val.properties || [];
    // 属性标题
    state.propertyTitle = val.propertyTitle || "";

    state.propertyList = val.propertyList || [];


}, { deep: true, immediate: true });

onMounted(async () => {
    projectOptions.value = await getProjectList();
});

/**
 * 项目改变的回调
 */
watch(() => state.projectId, async (value) => {
    if (!value) return;
    if (projectOptions.value.length) {
        const index: number = projectOptions.value.findIndex((item: any) => item.value === state.projectId);
        state.projectName = index > -1 ? projectOptions.value[index].label : ''
    }

    groupOptions.value = await getGroupList(value);
}, { immediate: true });

/**
 * 分组改变的回调
 */
watch(() => state.groupId, async (value) => {
    if (!value) return;
    const index: number = groupOptions.value.findIndex((item: any) => item.value === state.groupId);
    state.groupName = index > -1 ? groupOptions.value[index].label : ''
    options.deviceOptions = await getDeviceList(value);
    state.devices = [...options.deviceOptions];
}, { immediate: true, deep: true });

/**
 * 设备改变的回调
 */
watch(() => state.deviceId, async (value) => {
    if (!value) return;
    try {
        options.deviceOptions.forEach((item: any) => {
            if (item.children && item.children.length > 0) {
                item.children.forEach((child: any) => {
                    if (child.value === value) {
                        state.deviceName = child.device_name
                        state.pluginId = child.pluginId;
                        throw new Error('break');
                    }
                })
            }
        })
    }
    catch (e) {
    }
}, { immediate: true, deep: true });

/**
 * @description: 插件id改变的回调
 * @return {*}
 */
watch(() => state.pluginId, async (value) => {
    if (!value) return;
    getPlugin(value);
}, { immediate: true, deep: true })


watchEffect(() => {
    if (state.deviceId && JSON.stringify(options.deviceOptions) !== "{}" && JSON.stringify(options.deviceOptions) !== "[]") {
        const index: number = options.deviceOptions?.findIndex((item: any) => item.value === state.deviceId);
        state.deviceName = index > -1 ? options.deviceOptions[index].label : ''
        if (index === -1) return;
        state.pluginId = options.deviceOptions[index].pluginId;
    }
})



/**
 * 属性改变
 */
watch(() => state.properties, async (value) => {
    if (!value || value.length === 0) return;
    state.propertyList = [];
    value.forEach((item: any) => {
        const index = options.tslOptions.findIndex((tsl: any) => tsl.name === item);
        state.propertyList.push(JSON.parse(JSON.stringify(options.tslOptions[index])));
    })
})

/**
 * 获取项目列表
 * @returns 
 */
async function getProjectList() {
    const { data: result } = await DeviceAPI.getProjectList(null);
    if (result.code === 200) {
        const { data } = result.data;
        const options = data.map((item: any) => ({ value: item.id, label: item.name }))
        return options;
    }

}
/**
 * 通过项目id获取分组列表
 * @param projectId
 * @returns 
 */
async function getGroupList(groupId: string) {
    const { data: result } = await DeviceAPI.getGroupList({ current_page: 1, per_page: 9999, business_id: groupId })
    if (result.code === 200) {
        const { data } = result;
        return data.data.map((item: any) => ({ value: item.id, label: item.name }))
    }
}

/**
 * 通过分组id获取设备列表
 * @param id 
 */
async function getDeviceList(id: string) {
    const params = { current_page: 1, per_page: 9999, asset_id: id }
    let { data: result } = await DeviceAPI.getDeviceList(params);
    if (result.code !== 200) return [];
    let arr = result.data?.data || [];
    return arr.map((item: any) => {
        if (item.children && item.children.length > 0) {
            item.children = item.children.map((child: any) => {
                return {
                    label: child.device_name, value: child.device, pluginId: child.type
                }
            })
        }
        return {
            label: item.device_name,
            value: item.device,
            pluginId: item.type,
            children: item.children || []
        }
    });
     

}

/**
 * 通过设备Id获取插件
 * @param deviceId
 * @returns 
 */
function getPlugin(pluginId: string) {
    return new Promise((resolve, reject) => {
        DeviceAPI.getPluginByDeviceId({ current_page: 1, per_page: 9999, id: pluginId })
            .then(({ data: result }) => {
                if (result.code === 200) {
                    const { data } = result.data;
                    const tsl = JSON.parse(data[0].chart_data).tsl;
                    const opt = JSON.parse(JSON.stringify(tsl.properties));
                    options.tslOptions = opt;
                    resolve(opt);
                }
            })
    })

}

/**
 * 删除设备
 * @param id 
 */
const handleDelete = (e: any) => {
    e.preventDefault();
    emit('delete', props.index)
}
</script>

<style lang="scss" scoped>
.header-icon {
    font-size: 16px;
    margin-left: 10px;
    cursor: pointer;
}
</style>