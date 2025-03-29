import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Async thunks
export const fetchWalletBalance = createAsyncThunk(
  'wallet/fetchBalance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/wallet/balance`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addMoney = createAsyncThunk(
  'wallet/addMoney',
  async ({ amount, paymentMethod }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/wallet/add-money`, {
        amount,
        paymentMethod,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const withdrawMoney = createAsyncThunk(
  'wallet/withdrawMoney',
  async ({ amount, bankAccountId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/wallet/withdraw`, {
        amount,
        bankAccountId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  'wallet/fetchTransactions',
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/wallet/transactions`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const sendMoney = createAsyncThunk(
  'wallet/sendMoney',
  async ({ amount, receiverId, note }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/wallet/send`, {
        amount,
        receiverId,
        note,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state
const initialState = {
  balance: 0,
  transactions: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    hasMore: true,
  },
};

// Slice
const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearTransactions: (state) => {
      state.transactions = [];
      state.pagination = initialState.pagination;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wallet Balance
      .addCase(fetchWalletBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWalletBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.balance;
      })
      .addCase(fetchWalletBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch balance';
      })
      // Add Money
      .addCase(addMoney.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMoney.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.balance;
        state.transactions.unshift(action.payload.transaction);
      })
      .addCase(addMoney.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to add money';
      })
      // Withdraw Money
      .addCase(withdrawMoney.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(withdrawMoney.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.balance;
        state.transactions.unshift(action.payload.transaction);
      })
      .addCase(withdrawMoney.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to withdraw money';
      })
      // Fetch Transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.page === 1) {
          state.transactions = action.payload.transactions;
        } else {
          state.transactions = [...state.transactions, ...action.payload.transactions];
        }
        state.pagination = {
          currentPage: action.payload.page,
          totalPages: action.payload.totalPages,
          hasMore: action.payload.page < action.payload.totalPages,
        };
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch transactions';
      })
      // Send Money
      .addCase(sendMoney.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMoney.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.balance;
        state.transactions.unshift(action.payload.transaction);
      })
      .addCase(sendMoney.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to send money';
      });
  },
});

export const { clearError, clearTransactions } = walletSlice.actions;
export default walletSlice.reducer; 