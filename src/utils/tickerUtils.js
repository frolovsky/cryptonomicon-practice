const getSubscribeString = (ticker, currency = "USD") =>
  `5~CCCAGG~${ticker}~${currency}`;

const parseTickerParam = (sub) => sub.match(/\w+/g).reverse();

module.exports = {
  getSubscribeString,
  parseTickerParam,
};
