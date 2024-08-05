const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");
import successHandler from "../../common/successHandler";
import errorHandler from "../../common/errorHandler";
import bcrypt from 'bcryptjs';
import { generateTokens } from './token';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const checkEmail = async (event) => {
  const { email } = JSON.parse(event.body);
  if (!email) {
    return errorHandler({message:"Missing Email"},400);
  }

  try {
    // Check if the email exists
    const params = {
      TableName: "Users",
      Key: {
        email: email,
      },
    };

    const result = await docClient.send(new GetCommand(params));
    if (!result.Item) {
      return successHandler({ emailExist: false, message: "Email not found" });
    }

    return successHandler({ emailExist: true, message: "Email exists" });
  } catch (err) {
    console.log(err);
    return errorHandler({ message: "Server Error" }, 500);
  }
};

export const checkPassword = async (event) => {
  const { email, password } = JSON.parse(event.body);
  if (!email || !password) {
    return errorHandler({ message: 'Missing Email or Password' }, 400);
  }

  try {
    // Retrieve user data from DynamoDB
    const params = {
      TableName: 'Users',
      Key: {
        email: email,
      },
    };

    const result = await docClient.send(new GetCommand(params));
    if (!result.Item) {
      return errorHandler(
        { name: 'InvalidCredentials', message: 'Invalid email or password' },
        401
      );
    }

    // Compare provided password with stored hashed password
    const validPassword = await bcrypt.compare(password, result.Item.password);
    if (!validPassword) {
      return errorHandler(
        { name: 'InvalidCredentials', message: 'Invalid email or password' },
        401
      );
    }
    const userPayload = {
      email: result.Item.email,
      walletId: result.Item.walletId,
    };
    const tokens = generateTokens(userPayload);

    return successHandler({ message: 'Login Successfull!', tokens });
  } catch (err) {
    console.log(err);
    return errorHandler({ message: 'Server Error' }, 500);
  }
};