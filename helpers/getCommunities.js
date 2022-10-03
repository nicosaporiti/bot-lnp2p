const axios = require('axios');

const getCommunityOrderChannel = async (id, tg) => {
  const { data } = await axios.get(`https://api.lnp2pbot.com/community/${id}`);
  const channel = await data.order_channels[0].name.slice(1);
  const url = `https://t.me/${channel}/${tg}`;
  return url;
};

module.exports = { getCommunityOrderChannel };