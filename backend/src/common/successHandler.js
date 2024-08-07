export default function (response, statusCode = 200) {
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      // Add other headers as needed
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(response),
  };
}
