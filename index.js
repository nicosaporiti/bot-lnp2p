require('dotenv').config();
const { TwitterClient } = require('twitter-api-client');
const { sellOrders, buyOrders } = require('./helpers/getOrders');
const { getCommunityOrderChannel } = require('./helpers/getCommunities');

const twitterClient = new TwitterClient({
  apiKey: process.env.TWITTER_API_KEY,
  apiSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

// Prime Orders

let primeOrders = [];

const primeBuyOrdersbyMargin = async () => {
  const orders = await buyOrders();
  const primeBuyOrders = orders.filter(
    (order) => order.price_from_api && order.price_margin >= 1
  );
  return primeBuyOrders;
};

const primeSellOrdersbyMargin = async () => {
  const orders = await sellOrders();
  const primeSellOrders = orders.filter(
    (order) => order.price_from_api && order.price_margin <= 0
  );
  return primeSellOrders;
};

// if order exists in primeOrders, don't add it
const addPrimeOrders = async () => {
  const buyOrders = await primeBuyOrdersbyMargin();
  const sellOrders = await primeSellOrdersbyMargin();
  const orders = buyOrders.concat(sellOrders);
  return orders;
};

let twitedOrders = [];
let twitedId = [];

// Twit prime orders
const twitPrimeOrders = async () => {
  primeOrders = await addPrimeOrders();

  primeOrders.forEach(async (order) => {
    if (twitedId.includes(order._id) === false) {
      const {
        description,
        type,
        price_margin,
        community_id,
        tg_channel_message1,
      } = order;
      const twit = `
      ${type === 'sell' ? '🔴 Venta #Bitcoin ' : '🟢 Compra #Bitcoin '} ${
        price_margin === 0
          ? 'a precio de Mercado!'
          : 'con prima de ' + price_margin + ' %'
      }
     
      ${description.substr(0, 80) + '...'}
      ${
        !community_id
          ? 'https://t.me/p2plightning/' + tg_channel_message1
          : await getCommunityOrderChannel(community_id, tg_channel_message1)
      }`;

      twitedOrders.push(order);
      twitedId.push(order._id);

      twitterClient.tweets
        .statusesUpdate({
          status: twit,
        })
        .then((response) => {
          console.log('Twited: ', response);
        })
        .catch((error) => {
          console.log('Error: ', error);
        });
    // console.log(twit);
    }
    console.log(twitedId);
  });
  // console.log(`Total órdenes en arbitraje: ${twitedOrders.length}`);
};

console.log(`

Iniciando búsqueda de arbitrajes...

`);

setInterval(twitPrimeOrders, 10000);
