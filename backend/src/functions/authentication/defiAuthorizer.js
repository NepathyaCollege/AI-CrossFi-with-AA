import { verifyToken } from './tokenVerification';

export const handler = async (event) => {
  console.log(event);

  // Extract the token from the Authorization header
  const token = event.authorizationToken.replace('Bearer ', '');
  if (!token) {
    console.error('No token provided in Authorization header');
    return {
      body: JSON.stringify('No token provided in Authorization header'),
    };
  }

  // Initialize policy document with Deny effect
  const policyDocument = {
    Version: '2012-10-17',
    Statement: [
      {
        Action: '*',
        Effect: 'Deny',
        Resource: '*',
      },
    ],
  };

  let userPayload;

  try {
    // Verify the token
    userPayload = verifyToken(token);
    console.log(userPayload);
    // If token is valid, update the policy document to Allow
    if (userPayload) {
      policyDocument.Statement[0].Effect = 'Allow';
    }
  } catch (error) {
    console.error('Token verification error:', error);
  }

  // Return the policy document
  return {
    principalId: userPayload?.id || 'unknown',
    policyDocument,
  };
};
