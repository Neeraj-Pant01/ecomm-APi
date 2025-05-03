// services/shiprocket.js
const axios = require("axios");

let token = null;

async function getToken() {
  if (token) return token;

  const res = await axios.post("https://apiv2.shiprocket.in/v1/external/auth/login", {
    email: process.env.SHIPROCKET_EMAIL,
    password: process.env.SHIPROCKET_PASSWORD,
  });
  token = res.data.token;
  return token;
}

async function createShipment(orderDetails) {
  const authToken = await getToken();

  const response = await axios.post(
    "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
    orderDetails,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  return response.data;
}

module.exports = {
  createShipment,
};
