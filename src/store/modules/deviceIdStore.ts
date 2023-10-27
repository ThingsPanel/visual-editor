import { defineStore } from 'pinia'

export const useDeviceIdStore = defineStore('deviceIdStore', () => {
    let _id: string = "";

    const setDeviceId = (id: string) => {
        _id = id;
    }

    const getDeviceId = () => {
        if (!_id) {
            return "";
        }
        return _id;
    }

    return { setDeviceId, getDeviceId }
})