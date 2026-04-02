import { Unsubscribe } from "./utils";

export class RobustWebsocket {
  private url: string;
  private ws: WebSocket | null = null;
  private closed = false;

  private messageQueue: any[] = [];
  private listeners: ((data: any) => void)[] = [];

  private retryTimeout = 3000;

  constructor(url: string) {
    this.url = url;
    this.connect();
  }

  connect() {
    if (this.ws) {
      return;
    }

    const ws = this.ws = new WebSocket(this.url);
    this.closed = false;

    this.setupWebsocket(ws);
  }

  private attemptReconnect(timeout: number) {
    if (this.closed) {
      return;
    }

    if (this.ws && this.ws.readyState === WebSocket.CLOSED) {
      this.ws = null;
    }

    setTimeout(() => {
      this.connect();
    }, timeout);
  }

  private setupWebsocket(ws: WebSocket) {
    ws.onopen = () => {
      this.connectListeners.forEach((l) => l());
      this.messageQueue.forEach((msg) => ws.send(msg));
      this.messageQueue = [];
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.listeners.forEach((listener) => listener(data));
    };

    ws.onerror = (event) => {
      console.error("WebSocket error:", event);
      this.attemptReconnect(this.retryTimeout);
    };

    ws.onclose = () => {
      this.ws = null;
      this.attemptReconnect(this.retryTimeout);
    };
  }

  close() {
    this.closed = true;
    if (this.ws) {
      this.ws.close();
    }
  }

  send(data: any) {
    const message = JSON.stringify(data);
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      this.messageQueue.push(message);
    }
  }

  listen(listener: (data: any) => void): Unsubscribe {
    this.listeners.push(listener);

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private connectListeners: (() => void)[] = [];
  onConnect(listener: () => void): Unsubscribe {
    this.connectListeners.push(listener);
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      listener();
    }

    return () => {
      this.connectListeners = this.connectListeners.filter((l) => l !== listener);
    };
  }
}
