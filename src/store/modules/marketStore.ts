/*
 * @Author: chaoxiaoshu-mx leukotrichia@163.com
 * @Date: 2023-07-04 11:01:51
 * @LastEditors: chaoxiaoshu-mx leukotrichia@163.com
 * @LastEditTime: 2023-11-15 15:29:09
 * @FilePath: \tp-editor\src\store\modules\marketStore.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from 'pinia'
import { MarketApi } from "@/api/market"

export const useMarketStore = defineStore('marketStore', () => {
    const MARKET_TOKEN_KEY = "marketToken";
    let _token: string = "";
    let isLogined: boolean = false;

    const setToken = (token: string) => {
        _token = token;
        window.localStorage.setItem(MARKET_TOKEN_KEY, _token);
    }

    const getToken = () => {
        if (!_token) {
            _token = window.localStorage.getItem(MARKET_TOKEN_KEY) || "";
        }
        return _token;
    }

    /**
     * 登录状态
     */
    const loginStatus = async () => {
        let res = await MarketApi.getSecret();
        if (res && res.status === 200) {
            isLogined = true
        } else {
            isLogined = false;
        }
        return isLogined;
    }

    return { setToken, getToken, loginStatus }
})