import { configureStore } from "@reduxjs/toolkit";
import walletSlice from "./wallet/walletSlice";
import transactionSlice from "./transaction/transactionSlice";

const store = configureStore({
  reducer: {
    wallet: walletSlice,
    transaction: transactionSlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["wallet/connectWallet/fulfilled"],
        ignoredPaths: ["wallet.personalAccount", "wallet.smartAccount"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
