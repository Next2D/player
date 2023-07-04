export interface EventListenerImpl {
    listener: Function;
    priority: number;
    useCapture: boolean;
    target: any;
}