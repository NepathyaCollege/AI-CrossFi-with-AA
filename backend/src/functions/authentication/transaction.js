import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import successHandler from '../../common/successHandler';
import errorHandler from '../../common/errorHandler';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { verifyTokenEndpoint } from './tokenVerification';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const storeTransaction = verifyTokenEndpoint(async (event) => {
  const { transactionHash } = event.pathParameters;
  const { email } = event.decoded;

  if (!transactionHash) {
    return errorHandler({ message: 'Missing transaction hash' }, 400);
  }

  const params = {
    TableName: 'TransactionHistory',
    Item: {
      email,
      transactionHash,
      timestamp: new Date().toISOString(),
    },
  };

  try {
    await docClient.send(new PutCommand(params));
    return successHandler({ message: 'Transaction stored successfully' }, 201);
  } catch (error) {
    console.error('DynamoDB error:', error);
    return errorHandler({ message: 'Internal Server Error' }, 500);
  }
});

export const getTransactions = verifyTokenEndpoint(async (event) => {
  const { limit = 10, lastEvaluatedKey } = event.queryStringParameters || {};
  const { email } = event.decoded;

  // Parse and sanitize limit
  const parsedLimit = Math.min(parseInt(limit, 10), 50);
  const params = {
    TableName: 'TransactionHistory',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': { S: email },
    },
    Limit: parsedLimit,
    ExclusiveStartKey: lastEvaluatedKey
      ? JSON.parse(lastEvaluatedKey)
      : undefined,
  };

  try {
    // Query the DynamoDB table
    const result = await docClient.send(new QueryCommand(params));

    // Transform DynamoDB items to plain JS objects
    const transactions = (result.Items || []).map(
      (item) => item.transactionHash.S
    );

    // Return paginated results
    return successHandler(
      {
        transactions: transactions,
        limit: parsedLimit,
        nextPageToken: result.LastEvaluatedKey
          ? JSON.stringify(result.LastEvaluatedKey)
          : null,
      },
      200
    );
  } catch (error) {
    console.error('DynamoDB error:', error);
    return errorHandler({ message: 'Internal Server Error' }, 500);
  }
});
