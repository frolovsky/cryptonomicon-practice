const tickerHandlers = new Map();

const getSubscribeString = (ticker) => `5~CCCAGG~${ticker}~USD`;

const updateTicker = (name, price) => {
  if (price === undefined) {
    return;
  }
  const ticker = tickerHandlers.get(name);
  if (!ticker || ticker.length === 0) {
    return console.log(name, " не найден в ticketHandlers");
  }
  ticker.forEach((handler) => {
    handler(name, price);
  });
};

const unsubscribeTickerService = (ticker, handlers) => {
  const t = tickerHandlers.get(ticker);
  if (!t) {
    throw new Error("ticker doesnt subscribed");
  }
  handlers.forEach((handler) => {
    const filteredHandlers = t.filter((h) => h !== handler);
    tickerHandlers.set(ticker, filteredHandlers);
  });
};

const subscribeTickerService = (tickerName, handler) => {
  const existHandlers = tickerHandlers.get(tickerName)
    ? tickerHandlers.get(tickerName)
    : [];
  tickerHandlers.set(tickerName, [...existHandlers, handler]);
};

const getTickerHandlers = (tickerName) => tickerHandlers.get(tickerName);

module.exports = {
  updateTicker,
  unsubscribeTickerService,
  subscribeTickerService,
  getSubscribeString,
  getTickerHandlers,
};
