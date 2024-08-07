export default function errorHandler(err, statusCode = 500) {
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      // Customize message based on specific errors if needed
      message: err.message || 'Internal server error',
    }),
  };
}
