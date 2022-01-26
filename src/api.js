import {
  updateTicker,
  unsubscribeTickerService,
  subscribeTickerService,
  getTickerHandlers,
  crossConvertHandler,
  DEFAULT_CURRENCY,
} from "@/services/tickerService";

import { getSubscribeString, parseTickerParam } from "@/utils/tickerUtils";

const AGGREGATE_INDEX = "5";
const ERROR_INDEX = "500";
const INVALID_SUB_MESSAGE = "INVALID_SUB";
const sharedWorker = new SharedWorker("workers/websocket-worker.js").port;

sharedWorker.start();

sharedWorker.addEventListener("message", (e) => {
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
  sharedWorker.postMessage({
    type: "manageWS",
    body: {
      action: action,
      subs: [subs],
    },
  });
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
