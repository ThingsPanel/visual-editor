import axios from "./interceptor/http"

export default {

    /**
     * 通过id获取大屏数据
     * @param data 
     * @returns 
     */
    getJsonDataById: (data: any) => {
        const page = data.current_page;
        const page_size = data.per_page;
        const id = data.id;
        const share_id = data.share_id;
        return axios.request({
            url: `/vis/plugin/dashboard?page=${page}&page_size=${page_size}`
                + (id ? `&id=${id}` : '')
                + (share_id ? `&share_id=${share_id}` : ''),
            method: 'get'
        })
    },

    /**
     * 更新大屏数据
     * @param data 
     * @returns 
     */
    updateJsonDate: (data: any) => {
        return axios.request({
            url: '/vis/plugin/dashboard',
            method: 'put',
            data
        })

    },

    /**
     * 生成分享id
     * @param data 
     * @returns 
     */
    generateShareID: (data: any) => {
        return axios.request({
            url: '/share/generate',
            method: 'post',
            data
        })

    },

    /**
     * 根据分享id获取可视化id
     * @param data 
     * @returns 
     */
    getSharedDashboard: (data: any) => {
        return axios.request({
            url: '/share/get',
            method: 'post',
            data
        })

    }

} 