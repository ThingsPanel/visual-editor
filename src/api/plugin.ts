import axios from "./interceptor/http"

export default {

    /**
     * 批量上传自定义图形
     * @param data 
     * @returns 
     */
    uploadPicPlugins: (data: any) => {
        return axios.request({
            url: 'tp_vis_files/up',
            method: 'post',
            data
        })
    },

    /**
     * 获取自定义图形
     * @param data 
     */
    getPicPlugins: (data: any) => {
        const page = data.current_page;
        const page_size = data.per_page;
        return axios.request({
            url: `/vis/plugin/list?page=${page}&page_size=${page_size}`,
            method: 'get'
        })
    },


    /**
     * 上传插件
     * @param data 
     * @returns 
     */
    uploadPlugin: (data: any) => {
        return axios.request({
            url: '/vis/plugin/up',
            method: 'post',
            data
        })
    },

    /**
     * 从TP获取插件列表
     * @param data 
     * @returns 
     */
    getPluginList: (data: any) => {
        const page = data.current_page;
        const page_size = data.per_page;
        return axios.request({
            url: `/vis/plugin/local?page=${page}&page_size=${page_size}`,
            method: 'get'
        })
    },

    /**
     * 插件URL存入TP
     * @param data 
     * @returns 
     */
    addPlugintoTP: (data: any) => {
        return axios.request({
            url: '/vis/plugin/local',
            method: 'post',
            data
        })
    },

    /**
     * 从TP删除插件
     * @param data 
     * @returns 
     */
    delPluginfromTP: (data: any) => {
        return axios.request({
            url: `/vis/plugin/dashboard/${data.id}`,
            method: 'delete'
        })
    },

    getPlugin: (url: string) => {
        return axios.request({
            url,
            method: 'post'
        })
    }
}