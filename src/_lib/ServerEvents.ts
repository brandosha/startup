import { Post } from "./PostsManager";
import { RobustWebsocket } from "./RobustWebsocket";
import { Unsubscribe } from "./utils";

class ServerEvents {
  private ws = new RobustWebsocket('/ws');
  private listeners: Record<string, ((data: any) => void)[]> = {};

  constructor() {
    this.ws.listen(data => {
      console.log("Received server event:", data);
      this.listeners[data.channel]?.forEach((listener) => listener(data.payload));
    })

    this.ws.onConnect(() => {
      Object.keys(this.listeners).forEach(channel => {
        if (this.listeners[channel].length > 0) {
          this.ws.send({ type: "subscribe", channel });
        }
      });
    });
  }

  private listenToChannel(channel: string, listener: (data: any) => void): Unsubscribe {
    if (!this.listeners[channel]) {
      this.listeners[channel] = [];
      this.ws.send({ type: "subscribe", channel });
    }
    this.listeners[channel].push(listener);

    return () => {
      this.listeners[channel] = this.listeners[channel].filter((l) => l !== listener);
    };
  }

  subscribeNewPosts(listener: (data: Post) => void): Unsubscribe {
    return this.listenToChannel("new_posts", (data) => {
      console.log("Received new post event:", data);
      listener(data);
    });
  }

  subscribeComments(postId: string, listener: (data: any) => void): Unsubscribe {
    return this.listenToChannel(`${postId}/comments`, listener);
  }
}

export const serverEvents = new ServerEvents();