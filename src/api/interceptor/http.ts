/*
 * @Author: chaoxiaoshu-mx leukotrichia@163.com
 * @Date: 2023-05-22 18:41:12
 * @LastEditors: chaoxiaoshu-mx leukotrichia@163.com
 * @LastEditTime: 2023-10-25 12:52:37
 * @FilePath: \tp-editor\src\api\interceptor\http.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ITokenInfo, useAuthStore } from '@/store';
import axios from 'axios'
import config from '../config'
import  router  from '@/router/index';

const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

/**
 * @author cxs
 * @date 2023-05-24
 * @update 2023-05-24
 * @description http请求拦截器
 */
class HttpRequest {
    baseUrl: string;
    tokenInfo: ITokenInfo = <ITokenInfo>{};
    
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl
    }

    getInsideConfig() {
        this.tokenInfo = useAuthStore().getTokenInfo();
        const config = {
            baseUrl: this.baseUrl,
            headers: {
                "Content-Type": "application/octet-stream",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
                //"Authorization": `Bearer ${this.tokenInfo.token}`
                "X-Token": this.tokenInfo.token
            }
        }
        return config
    }

    interceptors(instance: any) {
        // 添加请求拦截器
        instance.interceptors.request.use((config: any) => {
            // 分享的请求需要在header加上shareID
            const shareUrl = [
                "tp_vis_plugin/list",
                "tp_local_vis_plugin/list",
                "tp_dashboard/list",
                "kv/current",
                "share/get",
                "kv/history",
                "device/operating_device",
                "vis/plugin/list",
                "vis/plugin/local",
                "vis/plugin/dashboard",
                "vis/plugin/share",
            ]

            console.log('config', config)
            // 在发送请求之前做些什么
            if (config.url.startsWith('/')) {
                config.url = config.url.replace('/', '')
            }
            const { token, expiresTime } = this.tokenInfo;
            const shareToken = useAuthStore().getShareTokenInfo();
            const now = Date.now();

            if (router.currentRoute.value.path.startsWith("/share/") && shareToken) {
                // 判断config.url是否由shareUrl中的url开头
                let isShareUrl = false;
                for (let i = 0; i < shareUrl.length; i++) {
                    if (config.url.startsWith(shareUrl[i])) {
                        config.headers["X-Token"] = `ShareID ${shareToken}`
                        config.url = config.baseUrl + config.url;
                        return config;
                    }
                }
            }
                
            // 没有 token 或者时间大于 expires_in 重定向到登录
            if(!token || !expiresTime || now > Number(expiresTime)) {
                useAuthStore().destroyToken()
                
                // 临时策略
                if (config.url === 'tp_local_vis_plugin/list' || config.url === 'tp_vis_plugin/list') {
                    config.url = config.baseUrl + config.url;
                    return config;
                }
                // window.location.href = '/#/login'
                // return false; // 阻止后面的请求
                return config;
            }

            config.url = config.baseUrl + config.url;
            return config;
        }, function (error: any) {
            // 对请求错误做些什么
            return Promise.reject(error);
        });

        // 添加响应拦截器
        instance.interceptors.response.use(function (response: Response) {
            // 对响应数据做点什么
            return response;
        }, function (error: any) {
            // 对响应错误做点什么
            return Promise.reject(error);
        });
    }

    request(options: any) {
        const instance = axios.create()
        options = { ...this.getInsideConfig(), ...options }
        this.interceptors(instance)
        return instance(options)
    }
}

export default new HttpRequest(baseUrl)