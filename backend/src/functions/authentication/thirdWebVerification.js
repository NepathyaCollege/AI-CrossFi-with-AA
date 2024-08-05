export const handler = async (event) => {
  try {

    // Response object to return
    const response = {
      userId: "hellouserid",
      email: "nirajbhattarai19@gmail.com",
      exp: Math.floor(Date.now() / 1000) + 3 * 60 + 60 * 3000000,
    };
    // deleting used key

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(response),
    };
  } catch (err) {
    console.log(err);
    // Error handling
    console.error("Error processing request:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
  }
};
