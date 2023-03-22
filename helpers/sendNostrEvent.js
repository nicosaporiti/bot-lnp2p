const sendNostrEvent = async (msg) => {
  const newEvent = {
    kind: 1,
    pubkey: '0a1179dc850ce8c769e0ca71c0356273bef9b5626bda81af25330e61d87b5697',
    tags: [],
    created_at: Math.round(new Date().getTime() / 1000),
    content: msg,
  };

  await pool.publish(newEvent, (status, relay) => {
    if (status === 0) {
      console.log(`publish request sent to ${relay}`);
    }
    if (status === 1) {
      console.log(`event published by ${relay}`, newEvent);
    }
  });
};

export default { sendNostrEvent };