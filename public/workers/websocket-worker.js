const API_KEY =
  "74ee7d2a488a9dc44391021f1bedded4bb782aec418b2568c590fe4c0619f6b2";
const API_STRING = new URLSearchParams({
  api_key: API_KEY,
}).toString();
const ports = [];
const ws = new WebSocket(`wss://streamer.cryptocompare.com/v2?${API_STRING}`);

const manageWS = (data) => {
  if (ws.readyState !== ws.OPEN) {
    ws.addEventListener(
      "open",
      () => {
        ws.send(JSON.stringify(data));
      },
      { once: true }
    );
    return;
  }
  ws.send(JSON.stringify(data));
};

self.addEventListener("connect", (e) => {
  const port = e.ports[0];
  ports.push(port);

  port.addEventListener("message", (msgEvent) => {
    const { type, body } = msgEvent.data;
    switch (type) {
      case "manageWS":
        manageWS(body);
        break;
      default:
        console.log(type, " - Не найден обработчик");
    }
  });
  port.start();
});

ws.addEventListener("message", (e) => {
  ports.forEach((port) => {
    port.postMessage(e.data);
  });
});
