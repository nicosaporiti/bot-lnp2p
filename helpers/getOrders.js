const axios = require('axios');

const getOrders = async () => {
  const { data } = await axios.get('https://api.lnp2pbot.com/orders');
  return data;
};

const sellOrders = async () => {
  const orders = await getOrders();
  const sellOrders = orders.filter((order) => order.type === 'sell');
  return sellOrders;
};

const buyOrders = async () => {
  const orders = await getOrders();
  const buyOrders = orders.filter((order) => order.type === 'buy');
  return buyOrders;
};

module.exports = { getOrders, sellOrders, buyOrders };
