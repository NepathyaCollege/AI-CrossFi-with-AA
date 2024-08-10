import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import errorHandler from '../../common/errorHandler';
import successHandler from '../../common/successHandler';
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const userId = event.requestContext.authorizer.principalId;

    console.log(userId);

    const { principalId: email } = event.requestContext.authorizer;

    const key = uuidv4();

    const postParams = {
      TableName: 'ThirdWebVerification',
      Item: { email, key, userId },
    };

    await docClient.send(new PutCommand(postParams));

    return successHandler({ thirdWebKey: key });
  } catch (error) {
    console.log(error);
    return errorHandler(error);
  }
};
