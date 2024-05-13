import { defineStore } from 'pinia'

const TOKEN_KEY = "ve_token"; // "token" is used by main app, use "ve_token" to avoid conflict
const SHARE_TOKEN_KEY = "share_token";
const TOKEN_EXPIRES_TIME_KEY = "tokenExpiresTime";

export const useAuthStore = defineStore('authStore', () => {
    
    /*

    */
    const login = (tokenInfo: ITokenInfo) => {
        // 保存token信息
        setTokenInfo(tokenInfo);
        
    }

    const getTokenInfo = (): ITokenInfo => {
        const token = window.localStorage.getItem(TOKEN_KEY) || "";
        const expiresTime = window.localStorage.getItem(TOKEN_EXPIRES_TIME_KEY) || "";
        return { token, expiresTime};
    }

    const setTokenInfo = (tokenInfo: ITokenInfo): void => {
        window.localStorage.setItem(TOKEN_KEY, tokenInfo.token);
        let expires_in = Date.now() + Number(tokenInfo.expiresTime) * 1000;
        window.localStorage.setItem(TOKEN_EXPIRES_TIME_KEY, expires_in.toString());
    }

    // 分享token
    const getShareTokenInfo = (): string => {
        return window.localStorage.getItem(SHARE_TOKEN_KEY) || "";
    }

    const setShareTokenInfo = (tokenInfo: string): void => {
        window.localStorage.setItem(SHARE_TOKEN_KEY, tokenInfo);
    }

    const destroyToken = (): void => {
        setTokenInfo({ token: "", expiresTime: "" });
    }

    return {
        getTokenInfo, setTokenInfo, destroyToken, getShareTokenInfo, setShareTokenInfo,
    }
})
export interface ITokenInfo {

    /**
     * 令牌
     */
    token: string;

    /**
     * 过期时间
     */
    expiresTime: string;
}



