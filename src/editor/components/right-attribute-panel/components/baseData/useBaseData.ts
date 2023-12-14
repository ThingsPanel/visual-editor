/*
 * @Author: chaoxiaoshu-mx leukotrichia@163.com
 * @Date: 2023-05-29 09:01:33
 * @LastEditors: chaoxiaoshu-mx leukotrichia@163.com
 * @LastEditTime: 2023-11-15 15:35:28
 * @FilePath: \tp-editor\src\editor\components\right-attribute-panel\components\baseData\useBaseData.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import DeviceAPI from "@/api/device";
import { reactive, ref } from "vue";


export const useBaseData = () => {
    const state = reactive({
        bindType: 'static',
        static: '',
        dynamic: '',
        device: '',
        projectId: '',
        groupId: ''
    })

    const projectOptions = ref<any>([]);
    const groupOptions = ref<any>([]);

    const bindOptions:any[] = [
        { value: 'static', label: '静态数据' }, 
        { value: 'dynamic', label: '动态数据'}, 
        { value: 'device', label: '设备数据'}
    ]

    const getProjectList = () => {
        DeviceAPI.getProjectList(null)
            .then(({ data: result }) => {
                if (result.code === 200) {
                    const { data } = result.data;
                    projectOptions.value = data.map((item: any) => ({ value: item.id, label: item.name }))
                }

            })
    }

    const getGroupList = (groupId: string) => {
        DeviceAPI.getGroupList({ current_page: 1, per_page: 9999, business_id: groupId })
            .then(({ data: result }) => {
                if (result.code === 200) {
                    const { data } = result;
                    groupOptions.value = data.map((item: any) => ({ value: item.id, label: item.name }))
                }
            })
    }

    const handleChangeProject = (value: string) => {
        state.projectId = value;
        getGroupList(value);
    }

    const handleChangeGroup = (value: string) => {

    }


    return {
        state,
        bindOptions,
        projectOptions,
        groupOptions,
        getProjectList,
        getGroupList,
        handleChangeProject,
        handleChangeGroup
    }
}