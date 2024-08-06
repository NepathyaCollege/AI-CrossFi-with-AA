import { createAsyncThunk } from "@reduxjs/toolkit";
import { Account, inAppWallet, smartWallet } from "thirdweb/wallets";
import { createThirdwebClient } from "thirdweb";

import { baseSepolia } from "thirdweb/chains";
import { CLIENT_ID, FACTORY_ADDRESS, OAUTH_KEY, ENCRYPTION_KEY } from "../../config/thirdweb";

//after logged in
export const client = createThirdwebClient({ clientId: CLIENT_ID });

//personal wallet
const personalWallet = inAppWallet({
  // @ts-ignorexxsx
  chain: baseSepolia,
  clientId: CLIENT_ID,
});

//smart wallet creation  after logged int
const Swallet = smartWallet({
  chain: baseSepolia,
  factoryAddress: FACTORY_ADDRESS,
  gasless: true,
  sponsorGas: true,
  // clientId: CLIENT_ID,
});

export const connectWallet = createAsyncThunk(
  "wallet/connectWallet",
  async (_, { rejectWithValue }) => {
    try {
      // Connect to personal wallet
      const personalAccount = await personalWallet.connect({
        // clientId: CLIENT_ID,
        client,
        chain: baseSepolia,
        strategy: "auth_endpoint",
        payload: JSON.stringify({ oauthKey: OAUTH_KEY }),
        encryptionKey: ENCRYPTION_KEY,
      });
      // debugger;

      // Connect to smart wallet
      const smartAccount = await Swallet.connect({
        chain: baseSepolia,
        client,
        personalAccount,
      });
      return {
        personalAccount: personalAccount,
        smartAccount: smartAccount,
      };
    } catch (_error) {
      return rejectWithValue("Failed to connect wallet");
    }
  }
);
