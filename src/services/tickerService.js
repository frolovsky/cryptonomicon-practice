const tickerHandlers = new Map();
const crossConvertedTickers = new Map();
const DEFAULT_CURRENCY = "USD";

const getCrossConvertedTickers = (currency) =>
  crossConvertedTickers.get(currency);

const setCrossConvertedTicker = (tickerName, currency, price) => {
  const currencyStorage = getCrossConvertedTickers(currency);
  currencyStorage
    ? crossConvertedTickers.set(currency, [
        ...currencyStorage,
        { tickerName, price },
      ])
    : crossConvertedTickers.set(currency, [{ tickerName, price }]);
};

const crossConvertHandler = (name, currency, price) => {
  if (currency !== DEFAULT_CURRENCY) {
    setCrossConvertedTicker(name, currency, price);
  } else {
    const crossConvertedTickers = getCrossConvertedTickers(name);
    if (crossConvertedTickers && crossConvertedTickers.length) {
      crossConvertedTickers.forEach(({ tickerName, price: oldPrice }) => {
        const convertedPrice = price * oldPrice;
        updateTicker(tickerName, { price: convertedPrice, isValid: true });
      });
    }
  }
};

const getSubscribeString = (ticker, currency = "USD") =>
  `5~CCCAGG~${ticker}~${currency}`;

const parseTickerParam = (sub) => sub.match(/\w+/g).reverse();

const updateTicker = (name, { price, isValid = true }) => {
  if (price === undefined) {
    return;
  }
  const ticker = tickerHandlers.get(name);
  if (!ticker || ticker.length === 0) {
    return console.log(name, " не найден в ticketHandlers");
  }
  ticker.forEach((handler) => {
    handler(name, { price, isValid });
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
  parseTickerParam,
  crossConvertHandler,
  DEFAULT_CURRENCY,
};
