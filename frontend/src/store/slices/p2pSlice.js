import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Async thunks
export const fetchLendingOpportunities = createAsyncThunk(
  'p2p/fetchLendingOpportunities',
  async ({ riskLevel, minAmount, maxAmount }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/p2p/opportunities`, {
        params: { riskLevel, minAmount, maxAmount },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchMyLoans = createAsyncThunk(
  'p2p/fetchMyLoans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/p2p/my-loans`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchMyInvestments = createAsyncThunk(
  'p2p/fetchMyInvestments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/p2p/my-investments`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const requestLoan = createAsyncThunk(
  'p2p/requestLoan',
  async ({ amount, purpose, tenure }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/p2p/request-loan`, {
        amount,
        purpose,
        tenure,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const investInLoan = createAsyncThunk(
  'p2p/investInLoan',
  async ({ loanId, amount }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/p2p/invest`, {
        loanId,
        amount,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const repayLoan = createAsyncThunk(
  'p2p/repayLoan',
  async ({ loanId, amount }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/p2p/repay`, {
        loanId,
        amount,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state
const initialState = {
  lendingOpportunities: [],
  myLoans: [],
  myInvestments: [],
  loading: false,
  error: null,
  stats: {
    totalLent: 0,
    totalBorrowed: 0,
    activeLoans: 0,
    activeInvestments: 0,
    totalReturns: 0,
  },
};

// Slice
const p2pSlice = createSlice({
  name: 'p2p',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearOpportunities: (state) => {
      state.lendingOpportunities = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Lending Opportunities
      .addCase(fetchLendingOpportunities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLendingOpportunities.fulfilled, (state, action) => {
        state.loading = false;
        state.lendingOpportunities = action.payload;
      })
      .addCase(fetchLendingOpportunities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch lending opportunities';
      })
      // Fetch My Loans
      .addCase(fetchMyLoans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyLoans.fulfilled, (state, action) => {
        state.loading = false;
        state.myLoans = action.payload;
        state.stats.activeLoans = action.payload.filter(loan => loan.status === 'active').length;
        state.stats.totalBorrowed = action.payload.reduce((sum, loan) => sum + loan.amount, 0);
      })
      .addCase(fetchMyLoans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch loans';
      })
      // Fetch My Investments
      .addCase(fetchMyInvestments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyInvestments.fulfilled, (state, action) => {
        state.loading = false;
        state.myInvestments = action.payload;
        state.stats.activeInvestments = action.payload.filter(inv => inv.status === 'active').length;
        state.stats.totalLent = action.payload.reduce((sum, inv) => sum + inv.amount, 0);
        state.stats.totalReturns = action.payload.reduce((sum, inv) => sum + (inv.returns || 0), 0);
      })
      .addCase(fetchMyInvestments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch investments';
      })
      // Request Loan
      .addCase(requestLoan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestLoan.fulfilled, (state, action) => {
        state.loading = false;
        state.myLoans.push(action.payload);
      })
      .addCase(requestLoan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to request loan';
      })
      // Invest in Loan
      .addCase(investInLoan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(investInLoan.fulfilled, (state, action) => {
        state.loading = false;
        state.myInvestments.push(action.payload);
        state.lendingOpportunities = state.lendingOpportunities.filter(
          opp => opp.id !== action.payload.loanId
        );
      })
      .addCase(investInLoan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to invest in loan';
      })
      // Repay Loan
      .addCase(repayLoan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(repayLoan.fulfilled, (state, action) => {
        state.loading = false;
        const loan = state.myLoans.find(l => l.id === action.payload.id);
        if (loan) {
          loan.remainingAmount -= action.payload.amount;
          if (loan.remainingAmount <= 0) {
            loan.status = 'completed';
          }
        }
      })
      .addCase(repayLoan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to repay loan';
      });
  },
});

export const { clearError, clearOpportunities } = p2pSlice.actions;
export default p2pSlice.reducer; 