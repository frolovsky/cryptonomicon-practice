import {
  updateTicker,
  unsubscribeTickerService,
  subscribeTickerService,
  getSubscribeString,
  getTickerHandlers,
  parseTickerParam,
  crossConvertHandler,
  DEFAULT_CURRENCY,
} from "@/services/tickerService";

const API_KEY =
  "74ee7d2a488a9dc44391021f1bedded4bb782aec418b2568c590fe4c0619f6b2";
const API_STRING = new URLSearchParams({
  api_key: API_KEY,
}).toString();

const AGGREGATE_INDEX = "5";
const ERROR_INDEX = "500";
const INVALID_SUB_MESSAGE = "INVALID_SUB";

const ws = new WebSocket(`wss://streamer.cryptocompare.com/v2?${API_STRING}`);

ws.addEventListener("message", (e) => {
  const {
    PRICE: price,
    TYPE: type,
    FROMSYMBOL: name,
    MESSAGE: message,
    PARAMETER: param,
    TOSYMBOL: currency,
  } = JSON.parse(e.data);

  if (type === AGGREGATE_INDEX && price !== undefined) {
    updateTicker(name, { price, isValid: true });
    crossConvertHandler(name, currency, price);
  }

  if (type === ERROR_INDEX && message === INVALID_SUB_MESSAGE) {
    const [cur, tickerName] = parseTickerParam(param);
    updateTicker(tickerName, { price: "-", isValid: false });
    if (cur === DEFAULT_CURRENCY) {
      manageTickersInWS(getSubscribeString(tickerName, "BTC"), "SubAdd");
    }
  }
});

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
  subscribeTickerService(tickerName, handler);
  if (getTickerHandlers(tickerName).length < 2) {
    manageTickersInWS(getSubscribeString(tickerName), "SubAdd");
  }
};

const unsubscribeTicker = (ticker, handlers) => {
  unsubscribeTickerService(ticker, handlers);
  manageTickersInWS(getSubscribeString(ticker), "SubRemove");
};

export { subscribeTicker, unsubscribeTicker };
