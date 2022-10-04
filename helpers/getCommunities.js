const axios = require('axios');

const getCommunityOrderChannel = async (id, tg) => {
  try {
    const { data } = await axios.get(
      `https://api.lnp2pbot.com/community/${id}`
    );
    const channel = await data.order_channels[0].name.slice(1);
    const url = `https://t.me/${channel}/${tg}`;
    return url;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getCommunityOrderChannel };
