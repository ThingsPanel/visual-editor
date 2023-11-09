declare interface IWebsocket {

    init(url: string): void;

    onReady(callback: Function | null): void;

    send(data?: any): void;

    onMessage(onReceive: Function | undefined): void
}