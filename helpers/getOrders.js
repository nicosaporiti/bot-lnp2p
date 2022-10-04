const axios = require('axios');

const getOrders = async () => {
  try {
    const { data } = await axios.get('https://api.lnp2pbot.com/orders');
    return data;
  } catch (error) {
    console.log(error);
  }
};

const sellOrders = async () => {
  try {
    const orders = await getOrders();
    const sellOrders = orders.filter((order) => order.type === 'sell');
    return sellOrders;
  } catch (error) {
    console.log(error);
  }
};

const buyOrders = async () => {
  try {
    const orders = await getOrders();
    const buyOrders = orders.filter((order) => order.type === 'buy');
    return buyOrders;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getOrders, sellOrders, buyOrders };
