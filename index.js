require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { sellOrders, buyOrders } = require('./helpers/getOrders');
const { getCommunityOrderChannel } = require('./helpers/getCommunities');

// Prime Orders

let primeOrders = [];
const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });

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
  try {
    primeOrders = await addPrimeOrders();

    primeOrders.forEach(async (order) => {
      if (twitedId.includes(order._id) === false) {
        const { type, price_margin, community_id, tg_channel_message1 } = order;
        const twit = `
        ${type === 'sell' ? '🔴 Venta #Bitcoin ' : '🟢 Compra #Bitcoin '} ${
          price_margin === 0
            ? 'a precio de Mercado!'
            : 'con prima de ' + price_margin + ' %'
        }
        ${
          !community_id
            ? 'https://t.me/p2plightning/' + tg_channel_message1
            : await getCommunityOrderChannel(community_id, tg_channel_message1)
        }`;

        twitedOrders.push(order);
        twitedId.push(order._id);

        bot.sendMessage('-1001848129404', twit);
      }
      console.log(twitedId);
    });
  } catch (error) {
    console.log(error);
  }
};

console.log(`

Iniciando búsqueda de arbitrajes...

`);

setInterval(twitPrimeOrders, 10000);
