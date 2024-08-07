import { createSlice } from "@reduxjs/toolkit";
import { fetchTransactions } from "./transactionThunk";

interface ITransaction {
  transactionHash: string;
  timestamp: string;
}
interface ITransactionsState {
  transactions: ITransaction[];
  loading: boolean;
  error: string | null;
  nextPageToken: string | null;
  loadingSkeleton: boolean;
}

const initialState: ITransactionsState = {
  transactions: [],
  loading: false,
  error: null,
  nextPageToken: null,
  loadingSkeleton: false,
};
const transactionsSlice = createSlice({
  name: "transaction",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
        if (state.transactions.length === 0) {
          state.loadingSkeleton = true;
        }
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = [...state.transactions, ...action.payload.transactions];
        state.error = null;
        state.nextPageToken = action.payload.nextPageToken;
        state.loadingSkeleton = false;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.loadingSkeleton = false;
      });
  },
});

export default transactionsSlice.reducer;
