import { RobustWebsocket } from "./RobustWebsocket";

class ServerEvents {
  private ws = new RobustWebsocket('/ws');

  constructor() {
    this.ws.listen(data => {
      console.log("Received server event:", data);
    })
  }

  subscribeNewPosts() {
    this.ws.onConnect(() => {
      this.ws.send({ type: "subscribe", channel: "new_posts" });
    });
  }
}

export const serverEvents = new ServerEvents();