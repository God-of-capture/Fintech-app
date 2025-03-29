import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Async thunks
export const fetchPortfolio = createAsyncThunk(
  'investment/fetchPortfolio',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/investments/portfolio`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchFunds = createAsyncThunk(
  'investment/fetchFunds',
  async ({ category, searchQuery }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/investments/funds`, {
        params: { category, searchQuery },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const startSIP = createAsyncThunk(
  'investment/startSIP',
  async ({ fundId, amount, frequency }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/investments/sip`, {
        fundId,
        amount,
        frequency,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const stopSIP = createAsyncThunk(
  'investment/stopSIP',
  async (sipId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/investments/sip/${sipId}/stop`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const investLumpsum = createAsyncThunk(
  'investment/investLumpsum',
  async ({ fundId, amount }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/investments/lumpsum`, {
        fundId,
        amount,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const redeemInvestment = createAsyncThunk(
  'investment/redeem',
  async ({ investmentId, units }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/investments/redeem`, {
        investmentId,
        units,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state
const initialState = {
  portfolio: {
    totalValue: 0,
    totalReturns: 0,
    returnPercentage: 0,
    investments: [],
  },
  funds: [],
  activeSIPs: [],
  loading: false,
  error: null,
};

// Slice
const investmentSlice = createSlice({
  name: 'investment',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearFunds: (state) => {
      state.funds = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Portfolio
      .addCase(fetchPortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.loading = false;
        state.portfolio = action.payload;
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch portfolio';
      })
      // Fetch Funds
      .addCase(fetchFunds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFunds.fulfilled, (state, action) => {
        state.loading = false;
        state.funds = action.payload;
      })
      .addCase(fetchFunds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch funds';
      })
      // Start SIP
      .addCase(startSIP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startSIP.fulfilled, (state, action) => {
        state.loading = false;
        state.activeSIPs.push(action.payload);
      })
      .addCase(startSIP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to start SIP';
      })
      // Stop SIP
      .addCase(stopSIP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(stopSIP.fulfilled, (state, action) => {
        state.loading = false;
        state.activeSIPs = state.activeSIPs.filter(
          sip => sip.id !== action.payload.id
        );
      })
      .addCase(stopSIP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to stop SIP';
      })
      // Invest Lumpsum
      .addCase(investLumpsum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(investLumpsum.fulfilled, (state, action) => {
        state.loading = false;
        state.portfolio.investments.push(action.payload);
      })
      .addCase(investLumpsum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to invest';
      })
      // Redeem Investment
      .addCase(redeemInvestment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(redeemInvestment.fulfilled, (state, action) => {
        state.loading = false;
        const investment = state.portfolio.investments.find(
          inv => inv.id === action.payload.id
        );
        if (investment) {
          investment.units -= action.payload.units;
          if (investment.units <= 0) {
            state.portfolio.investments = state.portfolio.investments.filter(
              inv => inv.id !== action.payload.id
            );
          }
        }
      })
      .addCase(redeemInvestment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to redeem investment';
      });
  },
});

export const { clearError, clearFunds } = investmentSlice.actions;
export default investmentSlice.reducer; 