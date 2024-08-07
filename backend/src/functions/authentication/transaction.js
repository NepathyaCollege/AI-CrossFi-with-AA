// src/handler.jsimport { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
// import { verifyTokenEndpoint } from "./tokenVerification";
import successHandler from '../../common/successHandler';
import errorHandler from '../../common/errorHandler';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
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

export const getTransactions = async (event) => {
  const { limit = 10, lastEvaluatedKey } = event.queryStringParameters || {};

  // Parse and sanitize limit
  const parsedLimit = Math.min(parseInt(limit, 10), 50); // Maximum of 50 results per page

  // Set up the parameters for DynamoDB Scan
  const params = {
    TableName: 'TransactionHistory',
    Limit: parsedLimit,
    ExclusiveStartKey: lastEvaluatedKey
      ? JSON.parse(lastEvaluatedKey)
      : undefined,
  };

  try {
    // Scan the DynamoDB table
    const result = await docClient.send(new ScanCommand(params));

    // Transform DynamoDB items to plain JS objects
    const transactions = (result.Items || []).map((item) => ({
      email: item.email.S,
      transactionHash: item.transactionHash.S,
    }));

    // Return paginated results
    return successHandler(
      {
        transactions,
        limit: parsedLimit,
        nextPageToken: result.LastEvaluatedKey
          ? (JSON.stringify(result.LastEvaluatedKey))
          : null, // Pass next page token for pagination
      },
      200
    );
  } catch (error) {
    console.error('DynamoDB error:', error);
    return errorHandler({ message: 'Internal Server Error' }, 500);
  }
};