const API_KEY =
  "74ee7d2a488a9dc44391021f1bedded4bb782aec418b2568c590fe4c0619f6b2";
const API_STRING = new URLSearchParams({
  api_key: API_KEY,
}).toString();
const AGGREGATE_INDEX = "5";
const ws = new WebSocket(`wss://streamer.cryptocompare.com/v2?${API_STRING}`);
const tickerHandlers = new Map();

ws.addEventListener("message", (e) => {
  const { PRICE: price, TYPE: type, FROMSYMBOL: name } = JSON.parse(e.data);

  if (type === AGGREGATE_INDEX && price !== undefined) {
    const ticker = tickerHandlers.get(name);
    if (!ticker || ticker.length === 0) {
      return console.log(name, " не найден в ticketHandlers");
    }
    ticker.forEach((handler) => {
      handler(name, price);
    });
  }
});

const getSubscribeString = (ticker) => `5~CCCAGG~${ticker}~USD`;

const manageTickersInWS = (subs, action) => {
  if (ws.readyState !== ws.OPEN) {
    ws.addEventListener(
      "open",
      () => {
        ws.send(
          JSON.stringify({
            action: action,
            subs: [subs],
          })
        );
      },
      { once: true }
    );
    return;
  }
  ws.send(
    JSON.stringify({
      action: action,
      subs: [subs],
    })
  );
};

const subscribeTicker = (tickerName, handler) => {
  const existHandlers = tickerHandlers.get(tickerName)
    ? tickerHandlers.get(tickerName)
    : [];
  if (existHandlers.length === 0) {
    manageTickersInWS(getSubscribeString(tickerName), "SubAdd");
  }
  tickerHandlers.set(tickerName, [...existHandlers, handler]);
};

const unsubscribeTicker = (ticker, handlers) => {
  const t = tickerHandlers.get(ticker);
  if (!t) {
    return;
  }
  handlers.forEach((handler) => {
    const filteredHandlers = t.filter((h) => h !== handler);
    tickerHandlers.set(ticker, filteredHandlers);
  });
  manageTickersInWS(getSubscribeString(ticker), "SubRemove");
};

module.exports = {
  subscribeTicker,
  unsubscribeTicker,
};
