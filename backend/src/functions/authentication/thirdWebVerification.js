import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const thirdWebVerificationHandler = async (event) => {
  try {

    console.log(event);

    const { payload } = JSON.parse(event.body);


    const { thirdWebKey } = JSON.parse(payload);

    console.log(`thirdweb ${thirdWebKey}`);
    const params = {
      TableName: 'ThirdWebVerification',
      Key: {
        key: thirdWebKey,
      },
    };
    const { Item } = await docClient.send(new GetCommand(params));

    console.log(Item);

    // Response object to return
    const response = {
      userId: Item.userId,
      email: Item.email,
      exp: Math.floor(Date.now() / 1000) + 3 * 60 + 60 * 3000000,
    };

    // Returning response
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(response),
    };
  } catch (err) {
    console.log(err);
    // Error handling
    console.error('Error processing request:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    };
  }
};

// Wrap the handler with middleware
export const handler = thirdWebVerificationHandler;
