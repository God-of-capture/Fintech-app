import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Async thunks
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/users/profile`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateKYC = createAsyncThunk(
  'user/updateKYC',
  async (kycData, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/users/kyc`, kycData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addBankAccount = createAsyncThunk(
  'user/addBankAccount',
  async (accountData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/users/bank-accounts`, accountData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeBankAccount = createAsyncThunk(
  'user/removeBankAccount',
  async (accountId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/users/bank-accounts/${accountId}`);
      return accountId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state
const initialState = {
  profile: null,
  bankAccounts: [],
  kycStatus: 'pending',
  loading: false,
  error: null,
};

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateProfileImage: (state, action) => {
      if (state.profile) {
        state.profile.profileImage = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update profile';
      })
      // Update KYC
      .addCase(updateKYC.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateKYC.fulfilled, (state, action) => {
        state.loading = false;
        state.kycStatus = action.payload.kycStatus;
      })
      .addCase(updateKYC.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update KYC';
      })
      // Add Bank Account
      .addCase(addBankAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBankAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.bankAccounts.push(action.payload);
      })
      .addCase(addBankAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to add bank account';
      })
      // Remove Bank Account
      .addCase(removeBankAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeBankAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.bankAccounts = state.bankAccounts.filter(
          account => account.id !== action.payload
        );
      })
      .addCase(removeBankAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to remove bank account';
      });
  },
});

export const { clearError, updateProfileImage } = userSlice.actions;
export default userSlice.reducer; 