import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import errorHandler from "../common/errorHandler";
import successHandler from "../common/successHandler";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);


export const handler = async (event) => {
  try {
    const userId = event.requestContext.authorizer.principalId;

    // Recreate the verification record for the user
    const thirdWebKey = await recreateVerificationForUser(userId);
    
    // Remove sensitive fields
    delete thirdWebKey.userId;

    return successHandler(thirdWebKey);
  } catch (error) {
    console.log(error);
    return errorHandler(error);
  }
};
