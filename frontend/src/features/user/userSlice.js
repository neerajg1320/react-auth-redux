import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios";


const API_URL = `http://localhost:8080/api/v1`

// initialize userToken from local storage
const userToken = localStorage.getItem('userToken')
    ? localStorage.getItem('userToken')
    : null;


export const registerUser = createAsyncThunk(
    'user/register',
    async ({ username, email, password }, { rejectWithValue }) => {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        }
        await axios.post(
            `${API_URL}/auth/users/`,
            { username, email, password, re_password: password },
            config
        )
      } catch (error) {
        if (error.response && error.response.data.message) {
          return rejectWithValue(error.response.data.message)
        } else {
          return rejectWithValue(error.message)
        }
      }

    }
)

export const userLogin = createAsyncThunk(
    'user/login',
    async ({ email, password }, { rejectWithValue }) => {
      try {
        // configure header's Content-Type as JSON
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        }
        const { data } = await axios.post(
            `${API_URL}/auth/jwt/create/`,
            { email, password },
            config
        )
        console.log(`userLogin: data=${JSON.stringify(data)}`);

        // store user's token in local storage
        localStorage.setItem('userToken', data.access)
        return {
          ...data,
          userToken: data.access
        };
      } catch (error) {
        // return custom error message from API if any
        if (error.response && error.response.data.message) {
          return rejectWithValue(error.response.data.message)
        } else {
          return rejectWithValue(error.message)
        }
      }
    }
)

export const getUserDetails = createAsyncThunk(
    'user/getUserDetails',
    async (arg, { getState, rejectWithValue }) => {
      try {
        console.log(`getUserDetails: getState=${JSON.stringify(getState())}`)
        // get user data from store
        const { user } = getState()

        // configure authorization header with user's token
        const config = {
          headers: {
            Authorization: `Bearer ${user.userToken}`,
          },
        }
        const { data } = await axios.get(`${API_URL}/auth/users/me/`, config);
        return data
      } catch (error) {
        if (error.response && error.response.data.message) {
          return rejectWithValue(error.response.data.message)
        } else {
          return rejectWithValue(error.message)
        }
      }
    }
)

const initialState = {
  loading: false,
  userInfo: null,
  userToken,
  error: null,
  success: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('userToken') // deletes token from storage
      state.loading = false
      state.userInfo = null
      state.userToken = null
      state.error = null
    },
  },
  extraReducers: {
    // register user
    [registerUser.pending]: (state) => {
      state.loading = true
      state.error = null
    },
    [registerUser.fulfilled]: (state, { payload }) => {
      state.loading = false
      state.success = true // registration successful
    },
    [registerUser.rejected]: (state, { payload }) => {
      state.loading = false
      state.error = payload
    },
    [userLogin.pending]: (state) => {
      state.loading = true
      state.error = null
    },
    [userLogin.fulfilled]: (state, { payload }) => {
      console.log(`[userLogin.fulfilled]: state=${JSON.stringify(state)} payload=${JSON.stringify(payload)}`)
      state.loading = false
      state.userInfo = payload;
      state.userToken = payload.userToken;
    },
    [userLogin.rejected]: (state, { payload }) => {
      state.loading = false
      state.error = payload
    },
    [getUserDetails.pending]: (state) => {
      state.loading = true
    },
    [getUserDetails.fulfilled]: (state, { payload }) => {
      state.loading = false
      state.userInfo = payload
      console.log(`[getUserDetails.fulfilled]: ${state.userInfo}`);
    },
    [getUserDetails.rejected]: (state, { payload }) => {
      state.loading = false
    },
  },
})

export const { logout } = userSlice.actions;
export default userSlice.reducer;
