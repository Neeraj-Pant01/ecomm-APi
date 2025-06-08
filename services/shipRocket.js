// services/shiprocket.js
const axios = require("axios");

let token = null;
let tokenExpiry = null;

async function getToken() {
  // Return existing token if it's still valid
  if (token && tokenExpiry && new Date() < tokenExpiry) {
    return token;
  }

  try {
    const res = await axios.post("https://apiv2.shiprocket.in/v1/external/auth/login", {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    });

    token = res.data.token;
    // Set token expiry (assuming 24hr validity, adjust as needed)
    tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    return token;
  } catch (error) {
    console.error("Shiprocket authentication failed:", error.response?.data || error.message);
    throw new Error("Failed to authenticate with Shiprocket");
  }
}

// async function createShipment(orderDetails) {
//   try {
//     const authToken = await getToken();

//     // Ensure required fields are present
//     const payload = {
//       ...orderDetails,
//       shipping_is_billing: true, // Often required
//       billing_last_name: orderDetails.billing_last_name || "", // Sometimes required
//       shipping_customer_name: orderDetails.billing_customer_name,
//       shipping_address: orderDetails.billing_address,
//       shipping_city: orderDetails.billing_city,
//       shipping_pincode: orderDetails.billing_pincode,
//       shipping_state: orderDetails.billing_state,
//       shipping_email: orderDetails.billing_email,
//       shipping_phone: orderDetails.billing_phone,
//       shipping_country: orderDetails.billing_country || "India",
//       channel: "api"
//     };

//     const response = await axios.post(
//       "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
//       payload,
//       {
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (response.data.status && response.data.status !== "success") {
//       throw new Error(response.data.message || "Shiprocket order creation failed");
//     }

//     return response.data;
//   } catch (error) {
//     console.error("FULL SHIPROCKET ERROR:", {
//       status: error.response?.status,
//       headers: error.response?.headers,
//       data: error.response?.data || error.message,
//       config: {
//         url: error.config?.url,
//         data: JSON.parse(error.config?.data) // Log the actual sent payload
//       }
//     });
//     throw new Error(`Shiprocket order creation failed: ${error.response?.data?.message || error.message}`);
//   }
// }

async function createShipment(orderDetails) {
  try {
    const authToken = await getToken();
    
    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      orderDetails,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
    
  } catch (error) {
    // Improved error handling
    let errorData;
    try {
      errorData = error.response?.data || JSON.parse(error.message);
    } catch {
      errorData = error.message;
    }
    
    // console.error("Shiprocket API Error:", {
    //   status: error.response?.status,
    //   data: errorData,
    //   payload: orderDetails
    // });
    
    throw new Error(`Shiprocket order creation failed: ${JSON.stringify(errorData)}`);
  }
}

module.exports = {
  createShipment,
};