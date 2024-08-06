import { v4 as uuidv4 } from "uuid";
import successHandler from "../../common/successHandler";
import errorHandler from "../../common/errorHandler";
import bcrypt from "bcryptjs";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { generateOTP, sendOTP } from "./otp";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const signUp = async (event) => {
  const { email, password } = JSON.parse(event.body);
  if (!email || !password) {
    return errorHandler({ message: "Missing Email or Password" }, 400);
  }

  try {
    // Check if user already exists
    const params = {
      TableName: "Users",
      Key: {
        email: email,
      },
    };

    const result = await docClient.send(new GetCommand(params));
    if (result.Item) {
      return errorHandler({ message: "User already exists" }, 409);
    }

    // Generate OTP
    const otp = generateOTP();

    // Send OTP to user
    await sendOTP(email, otp);

    // Store OTP and other user information temporarily
    const user = {
      email,
      token: otp,
      otpExpires: new Date(Date.now() + 60 * 1000).toString(), // OTP expires in 1 minute
    };

    const postParams = {
      TableName: "EmailVerificationTokenTable",
      Item: user,
    };

    await docClient.send(new PutCommand(postParams));

    return successHandler({ message: "OTP sent successfully" }, 201);
  } catch (err) {
    console.error(err); // Log detailed error for debugging
    return errorHandler({ message: "Internal Server Error" }, 500);
  }
};

export const verifyOTP = async (event) => {
  const { email, otp, password } = JSON.parse(event.body);
  if (!email || !otp) {
    return errorHandler({ message: "Missing Email or OTP" }, 400);
  }

  try {
    const params = {
      TableName: "EmailVerificationTokenTable",
      Key: {
        email: email,
      },
    };

    const result = await docClient.send(new GetCommand(params));
    if (!result.Item) {
      return errorHandler({ message: "Invalid OTP" }, 401);
    }

    const user = result.Item;
    if (user.token !== otp || new Date(user.otpExpires) < new Date()) {
      return errorHandler({ message: "Invalid OTP" }, 401);
    }

    // Create the user account
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id:uuidv4(),
      email,
      password: hashedPassword,
      walletId: uuidv4(),
    };

    const postParams = {
      TableName: "Users",
      Item: newUser,
    };

    await docClient.send(new PutCommand(postParams));

    // Delete the user verification record
    const deleteParams = {
      TableName: "EmailVerificationTokenTable",
      Key: {
        email: email,
      },
    };

    await docClient.send(new DeleteCommand(deleteParams));

    return successHandler({ message: "User created successfully" }, 201);
  } catch (err) {
    console.error(err); // Log detailed error for debugging
    return errorHandler({ message: "Internal Server Error" }, 500);
  }
};