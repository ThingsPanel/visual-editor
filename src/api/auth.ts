import axios from './interceptor/http'

export default {

    getUserInfo: (_data: any) => {
        return axios.request({
            url: '/board/user/info',
            method: 'get'
        })
    },

    refreshToken: (_data: any) => {
        return axios.request({
            url: '/user/refresh',
            method: 'get'
        })
    }
}