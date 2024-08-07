import jwt from 'jsonwebtoken';

export const generateTokens = (user) => {
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1d',
  });
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
  return { accessToken, refreshToken };
};

export const verifyToken = (token, isAccessToken = true) => {
  const secret = isAccessToken
    ? process.env.ACCESS_TOKEN_SECRET
    : process.env.REFRESH_TOKEN_SECRET;
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    console.log(error);
    throw new Error('Token verification failed.');
  }
};

export const verifyTokenEndpoint = (handler) => async (event) => {
  const headers = event.headers || {};
  const authHeader = headers['authorization'] || headers['Authorization'];
  const token = authHeader ? authHeader.replace('Bearer ', '') : null;

  if (!token) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing Token' }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    };
  }

  try {
    const decoded = verifyToken(token); // Use the updated function
    event.decoded = decoded; // Attach decoded token to event
    return await handler(event); // Call the actual handler
  } catch (err) {
    console.log(err);
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Invalid or Expired Token ' }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    };
  }
};
