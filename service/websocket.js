const { WebSocketServer } = require('ws');

// const wss = new WebSocketServer({ port: 4001 });

const clients = {};
const channels = {};
let cid = 0;

exports.initWsServer = (httpServer) => {
  const wss = new WebSocketServer({ server: httpServer });
  console.log('WebSocket server initialized');

  wss.on('connection', (ws) => {
    const id = ++cid;
    clients[id] = ws;
    console.log(`Client ${id} connected`);

    const clientChannels = new Set();

    ws.on('message', (data) => {
      const msg = String.fromCharCode(...data);
      // console.log('received: %s', msg);

      try {
        const parsed = JSON.parse(msg);
        if (parsed.type === 'subscribe' && parsed.channel && typeof parsed.channel === 'string') {
          const channel = parsed.channel;
          if (!channels[channel]) {
            channels[channel] = new Set();
          }

          channels[channel].add(id);
          clientChannels.add(channel);
          console.log(`Client ${id} subscribed to channel ${channel}`);
        } else if (parsed.type === 'unsubscribe' && parsed.channel && typeof parsed.channel === 'string') {
          const channel = parsed.channel;
          if (channels[channel]) {
            channels[channel].delete(id);
            clientChannels.delete(channel);
            console.log(`Client ${id} unsubscribed from channel ${channel}`);
          }
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });

    ws.on('close', () => {
      delete clients[id];
      clientChannels.forEach(channel => {
        if (channels[channel]) {
          channels[channel].delete(id);
        }
      });

      console.log(`Client ${id} disconnected`);
    });
  });
}

exports.broadcast = (channel, message) => {
  const subscribers = channels[channel];
  console.log(`Broadcasting message to channel ${channel} with ${subscribers ? subscribers.size : 0} subscribers`);
  if (!subscribers) {
    return 0;
  }

  const msgString = JSON.stringify({
    type: 'message',
    channel,
    payload: message,
  });

  let numSent = 0;
  subscribers.forEach((id) => {
    const client = clients[id];
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(msgString);
      numSent++;
    }
  });

  return numSent;
};
