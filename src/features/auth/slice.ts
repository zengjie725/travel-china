import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User, LoginCredentials, RegisterCredentials } from './types';
import { storage } from '../../utils/storage';
import type { StorageUser } from '../../utils/storage';
import bcrypt from 'bcryptjs';

const MOCK_USERS_KEY = 'mock_users';

const getStoredUser = (): User | null => {
  const stored = storage.getUser();
  if (stored) {
    return {
      ...stored,
      createTime: new Date(stored.createTime),
      lastLoginTime: new Date(stored.lastLoginTime),
    };
  }
  return null;
};

const initialState: AuthState = {
  isLoggedIn: !!storage.getToken(),
  user: getStoredUser(),
  token: storage.getToken(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      storage.clearAll();
    },
    registerSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  registerSuccess,
  registerFailure,
  clearError,
} = authSlice.actions;

export const login = (credentials: LoginCredentials) => async (dispatch: any) => {
  dispatch(loginStart());
  try {
    const usersData = localStorage.getItem(MOCK_USERS_KEY);
    const users: StorageUser[] = usersData ? JSON.parse(usersData) : [];
    
    const user = users.find((u) => u.email === credentials.email);
    
    if (!user) {
      dispatch(loginFailure('邮箱或密码错误'));
      return;
    }
    
    const isPasswordValid = bcrypt.compareSync(credentials.password, user.password);
    
    if (!isPasswordValid) {
      dispatch(loginFailure('邮箱或密码错误'));
      return;
    }
    
    const updatedUser: StorageUser = {
      ...user,
      lastLoginTime: new Date().toISOString(),
    };
    
    const token = bcrypt.hashSync(user.email + Date.now().toString(), 10);
    
    storage.setUser(updatedUser);
    storage.setToken(token);
    
    const userObj: User = {
      ...updatedUser,
      createTime: new Date(updatedUser.createTime),
      lastLoginTime: new Date(updatedUser.lastLoginTime),
    };
    
    dispatch(loginSuccess({ user: userObj, token }));
  } catch (error) {
    dispatch(loginFailure('登录失败，请重试'));
  }
};

export const register = (credentials: RegisterCredentials) => async (dispatch: any) => {
  dispatch(loginStart());
  try {
    const usersData = localStorage.getItem(MOCK_USERS_KEY);
    const users: StorageUser[] = usersData ? JSON.parse(usersData) : [];
    
    const existingUser = users.find((u) => u.email === credentials.email);
    
    if (existingUser) {
      dispatch(registerFailure('该邮箱已被注册'));
      return;
    }
    
    const hashedPassword = bcrypt.hashSync(credentials.password, 10);
    
    const newUser: StorageUser = {
      userId: `user_${Date.now()}`,
      username: credentials.username,
      email: credentials.email,
      password: hashedPassword,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.email}`,
      createTime: new Date().toISOString(),
      lastLoginTime: new Date().toISOString(),
    };
    
    users.push(newUser);
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
    
    const token = bcrypt.hashSync(newUser.email + Date.now().toString(), 10);
    
    storage.setUser(newUser);
    storage.setToken(token);
    
    const userObj: User = {
      ...newUser,
      createTime: new Date(newUser.createTime),
      lastLoginTime: new Date(newUser.lastLoginTime),
    };
    
    dispatch(registerSuccess({ user: userObj, token }));
  } catch (error) {
    dispatch(registerFailure('注册失败，请重试'));
  }
};

export const socialLogin = (type: 'wechat' | 'qq') => async (dispatch: any) => {
  dispatch(loginStart());
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const mockUser: User = {
      userId: `social_${type}_${Date.now()}`,
      username: type === 'wechat' ? '微信用户' : 'QQ用户',
      email: `${type}_user@example.com`,
      avatar: type === 'wechat' 
        ? 'https://api.dicebear.com/7.x/avataaars/svg?seed=wechat'
        : 'https://api.dicebear.com/7.x/avataaars/svg?seed=qq',
      createTime: new Date(),
      lastLoginTime: new Date(),
    };
    
    const token = bcrypt.hashSync(mockUser.email + Date.now().toString(), 10);
    
    storage.setUser({
      ...mockUser,
      password: '',
      createTime: mockUser.createTime.toISOString(),
      lastLoginTime: mockUser.lastLoginTime.toISOString(),
    });
    storage.setToken(token);
    
    dispatch(loginSuccess({ user: mockUser, token }));
  } catch (error) {
    dispatch(loginFailure('登录失败，请重试'));
  }
};

export default authSlice.reducer;
