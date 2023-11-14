import { useAuthStore } from '@/store'

class Websocket implements IWebsocket {
    /**
     * WebSocket
     */
    private socket: WebSocket | null = null;

    private deviceId: String | undefined = undefined;

    private token: String | undefined = undefined;

    /**
     * 连接成功的回调
     */
    private onReadyCallback: Function | null = null;

    /**
     * 连接关闭的回调
     */
    private onCloseCallback: Function | null = null;

    constructor(deviceId?: String | undefined) {
        this.deviceId = deviceId || undefined;
        let wsServer = import.meta.env.VITE_WS_URL + "/ws/device/current";
        this.init(wsServer);
    }

    /**
     * 初始化Websocket
     * @param url 
     */
    public init(url: string): void {

        if (typeof (WebSocket) === "undefined") {
            alert("您的浏览器不支持socket")
        } else {
            let { getTokenInfo } = useAuthStore();
            this.token = getTokenInfo().token;
            // 创建websocket连接
            this.socket = new WebSocket(url);

            /**
             * 连接发生错误的回调方法
             * @param {*} err 
             */
            this.socket.onerror = (err: any): any => {
                this.socket = null;
            };

            /**
             * 连接成功建立的回调方法
             */
            this.socket.onopen = () => {
                if (this.deviceId) {
                    this.send({});
                }
                this.onReadyCallback && this.onReadyCallback();
            }

            /**
             * 连接关闭的回调方法
             */
            this.socket.onclose = () => {
                this.socket = null;
                this.onCloseCallback && this.onCloseCallback();
            }
        }
    }

    /**
     * 连接成功后的回调
     * @param {*} callback 
     */
    public onReady(callback: Function | null): void {
        this.onReadyCallback = callback;
    }

    /**
     * 发送消息
     * @param data 
     */
    public send(data: any): void {
        const params = {
            ...data,
            device_id: data.deviceId || this.deviceId,
            token: this.token
        }
        if (this.socket) {
            this.socket.send(JSON.stringify(params))
        }
    }

    /**
     * 接收消息
     * @param onReceive 
     */
    public onMessage(onReceive: Function | undefined): void {
        if (this.socket) {
            this.socket.onmessage = (event) => {
                onReceive && onReceive(event.data);
            }
        }
    }

    public close(): void {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }

}

export { Websocket }