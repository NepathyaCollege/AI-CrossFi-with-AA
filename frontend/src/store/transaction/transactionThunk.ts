import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { FETCH_TRANSACTION_URL } from "../../config/apiUrl";
import { getAccessToken } from "../../config/authTokens";

export const fetchTransactions = createAsyncThunk(
  "transaction/fetchTransactions",
  async (value: string | null, { rejectWithValue }) => {
    let nextPageToken = value;
    try {
      const response = await axios.get(
        `${FETCH_TRANSACTION_URL}/?limit=10&lastEvaluatedKey=${nextPageToken}`,
        {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        }
      );
      return response.data;
    } catch (_error) {
      // Return error message if request fails

      return rejectWithValue("Failed to fetch transactions");
    }
  }
);
